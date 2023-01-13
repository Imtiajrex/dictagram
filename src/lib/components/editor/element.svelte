<script lang="ts">
	import type { elementType, hierarchyType, customStyleType } from '$lib/utils/elements';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Resizer from './resizer.svelte';

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

	let customStyleContext = getContext('custom-style') as Writable<customStyleType | null>;
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
	device.subscribe((value) => {
		getWidthHeight();
	});
	$: if (content.length > 0) {
		getWidthHeight();
	}

	$: active = selectedElement == id;
	customStyleContext.subscribe((value) => {
		if (value) {
			style = value;
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
	});

	$: customStyle = `position:relative;width:100%;max-width:${defaultWidth}px;min-height:${defaultHeight}px;padding:${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px;`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={Component}
	style={customStyle}
	class={`${classname} ${elementId} element`}
	on:click={(e) => {
		selectedElement = id;
		customStyleContext.set(style);
		if (editor) editor.focus();
		e.stopPropagation();
	}}
	{id}
>
	<textarea
		id={`textarea_${id}`}
		bind:value={content}
		disabled={!active}
		class="opacity-0 absolute top-0 left-0 w-0 h-0"
	/>
	{#if content}
		{content}
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
