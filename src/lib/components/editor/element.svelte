<script lang="ts">
	import type { elementType, hierarchyType, customStyleType } from '$lib/utils/elements';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Unsubscriber, Writable } from 'svelte/store';
	import Resizer from './resizer.svelte';
	import * as _ from 'lodash';

	export let name: string;
	export let Component: any;
	export let id: string;
	export let elementId: string;
	export let classname: string = '';
	export let style: customStyleType = {
		desktop: '',
		mobile: '',
		tablet: ''
	};
	export let content: string = '';
	export let hierarchy: hierarchyType;
	export const children: elementType[] = [];
	export let selectedElement: string;

	let customStyleContext = getContext('custom-style') as Writable<{
		style: customStyleType;
		id: string;
	}>;
	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	let defaultWidth: number, defaultHeight: number;
	let customPadding = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20
	};
	let customStyler: Element;
	let elementComponent: Element;
	let editor: HTMLTextAreaElement;

	onMount(() => {
		editor = document.getElementById(`textarea_${id}`) as HTMLTextAreaElement;
		elementComponent = document.getElementById(id) as Element;
		getWidthHeight();

		customStyler = document.getElementById(`style_${id}`) as Element;
	});
	const getWidthHeight = () => {
		if (elementComponent) {
			defaultWidth = elementComponent.getBoundingClientRect().width;
			defaultHeight = elementComponent.getBoundingClientRect().height;
		}
	};

	$: active = selectedElement == id;
	const styleChanger = (value: { style: customStyleType; id: string }) => {
		if (value && value.id == id && selectedElement == id) {
			style = { ...value.style };
			if (customStyler)
				customStyler.innerHTML = `<style>
					#${id} {
						${style['desktop']}
					}
					@container canvas (max-width: 768px) and (min-width: 501px) {
						#${id} {
							${style['tablet']}
						}
					}
					@container canvas (max-width: 500px) {
						#${id} {
							${style['mobile']}
						}
					}
				</style>`;
		}
	};
	let unsubscribe: Unsubscriber | undefined;
	$: {
		if (active) unsubscribe = customStyleContext.subscribe(styleChanger);
		else {
			if (unsubscribe) unsubscribe();
		}
	}
	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	$: customStyle = `position:relative;width:100%;max-width:${defaultWidth}px;min-height:${defaultHeight}px;padding:${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px;`;
	const contentfulElement = ['heading', 'paragraph'];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={Component}
	style={customStyle}
	class={`${classname} ${elementId} element`}
	on:click={(e) => {
		selectedElement = id;
		customStyleContext.set({ style, id });
		e.stopPropagation();
	}}
	{id}
>
	{#if contentfulElement.includes(elementId)}
		{content}
		<textarea
			id={`textarea_${id}`}
			bind:value={content}
			disabled={!active}
			style={`padding:${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px;`}
			class="absolute top-0 left-0 w-full h-full"
		/>
	{:else}
		{name}
	{/if}
	{#if active}
		<Resizer bind:defaultWidth bind:defaultHeight bind:padding={customPadding} {hierarchy} />
	{/if}
</svelte:element>

<span id={`style_${id}`} />

<style>
	textarea {
		border: none;
		width: 100%;
		height: 100%;
		resize: none;
		overflow: hidden;
		background-color: transparent;
	}
	textarea:focus {
		outline: none;
	}
	.element {
		container-type: inline-size;
		container-name: element;
	}
</style>
