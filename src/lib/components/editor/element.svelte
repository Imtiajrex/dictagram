<script lang="ts">
	import './element.css';
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
	export let style: customStyleType;
	export let content: string = '';
	export let hierarchy: hierarchyType;
	export const children: elementType[] = [];
	export let selectedElement: string;
	import { cssVariables } from '$lib/utils/cssVariables';
	import { styleObjectToCSS, styleObjectToCssVariable } from '$lib/utils/styleCompiler';

	let customStyleContext = getContext('custom-style') as Writable<{
		style: customStyleType;
		id: string;
	}>;
	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	let containerWidth: number, containerHeight: number;
	let customPadding = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20
	};
	let desktopStyler: HTMLElement;
	let tabletStyler: HTMLElement;
	let mobileStyler: HTMLElement;
	let elementComponent: Element;
	let editor: HTMLTextAreaElement;

	onMount(() => {
		editor = document.getElementById(`textarea_${id}`) as HTMLTextAreaElement;
		elementComponent = document.getElementById(id) as HTMLElement;
		getWidthHeight();

		desktopStyler = document.getElementById(`style_desktop_${id}`) as HTMLElement;
		tabletStyler = document.getElementById(`style_tablet_${id}`) as HTMLElement;
		mobileStyler = document.getElementById(`style_mobile_${id}`) as HTMLElement;
	});
	const getWidthHeight = () => {
		if (elementComponent) {
			containerWidth = elementComponent.getBoundingClientRect().width;
			containerHeight = elementComponent.getBoundingClientRect().height;
		}
	};
	const updateStyle = (css: string, device: any) => {
		const deviceElementMap = {
			desktop: desktopStyler,
			tablet: tabletStyler,
			mobile: mobileStyler
		} as { [key: string]: HTMLElement };
		const containerQuery = {
			tablet: `@container canvas (min-width: 501px) and (max-width: 768px){`,
			mobile: `@container canvas (max-width: 500px){`
		} as { [key: string]: string };

		const deviceElement = deviceElementMap[device];
		if (deviceElement) {
			let tag = `<style>
					${containerQuery[device] || ''}
						.element{
							${css}
						}
					${containerQuery[device] ? '}' : ''}
					</style>`;
			if (deviceElement.innerHTML !== tag && css.length > 0) {
				deviceElement.innerHTML = tag;
			}
		}
	};
	$: {
		['desktop', 'tablet', 'mobile'].forEach((device) => {
			const val = device as 'desktop' | 'tablet' | 'mobile';
			const css = styleObjectToCssVariable(style[val], device);
			updateStyle(css, device);
		});
	}
	$: active = selectedElement == id;

	$: customStyle = `position:relative;width:100%;padding:${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px;`;
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
	use:cssVariables={style}
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
		<Resizer
			bind:style
			{containerWidth}
			{containerHeight}
			bind:padding={customPadding}
			{hierarchy}
		/>
	{/if}
</svelte:element>
<span id={`style_desktop_${id}`} />
<span id={`style_tablet_${id}`} />
<span id={`style_mobile_${id}`} />

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
</style>
