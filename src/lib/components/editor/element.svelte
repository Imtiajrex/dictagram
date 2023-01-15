<script lang="ts">
	import './element.css';
	import {
		type elementType,
		type hierarchyType,
		type customStyleType,
		type elementsKeyListType,
		addElement
	} from '$lib/utils/elements';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Unsubscriber, Writable } from 'svelte/store';
	import Resizer from './resizer.svelte';
	import * as _ from 'lodash';
	import { cssVariables } from '$lib/utils/cssVariables';
	import { styleObjectToCSS, styleObjectToCssVariable } from '$lib/utils/styleCompiler';
	import { asDropZone, type DropOperation } from 'svelte-drag-and-drop-actions';

	export let name: string;
	export let Component: any;
	export let id: string;
	export let elementId: string;
	export let classname: string = '';
	export let style: customStyleType;
	export let content: string = '';
	export let hierarchy: hierarchyType;
	export let children: elementType[] = [];
	export let selectedElement: string;
	export let childEnabled: boolean;

	let customStyleContext = getContext('custom-style') as Writable<{
		style: customStyleType;
		id: string;
	}>;
	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	let containerWidth: number, containerHeight: number;
	let desktopStyler: HTMLElement;
	let tabletStyler: HTMLElement;
	let mobileStyler: HTMLElement;
	let elementComponent: Element;
	let editor: HTMLTextAreaElement;
	onMount(() => {
		editor = document.getElementById(`textarea_${id}`) as HTMLTextAreaElement;
		const canvas = document.getElementById(`canvas`) as HTMLElement;
		if (canvas) {
			new ResizeObserver(getWidthHeight).observe(canvas);
		}
		elementComponent = document.getElementById(id) as HTMLElement;
		getWidthHeight();

		desktopStyler = document.getElementById(`style_desktop_${id}`) as HTMLElement;
		tabletStyler = document.getElementById(`style_tablet_${id}`) as HTMLElement;
		mobileStyler = document.getElementById(`style_mobile_${id}`) as HTMLElement;
	});
	const getWidthHeight = () => {
		elementComponent = document.getElementById(id) as HTMLElement;
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
						.${id}{
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
			const css = styleObjectToCssVariable(style[val], `${id}-${device}`);
			updateStyle(css, device);
		});
	}
	$: active = selectedElement == id;

	const contentfulElement = ['heading', 'paragraph'];
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	const onDrop = (x: number, y: number, Operation: DropOperation, DataOffered: any) => {
		if (!childEnabled) return 'not-allowed';
		console.log(childEnabled, elementId, DataOffered);
		addElement({
			elementID: DataOffered.element as elementsKeyListType,
			hierarchy: [...hierarchy]
		});
		tool.set(null);
		return DataOffered.element;
	};
</script>

<span class="h-0 opacity-0 absolute">
	<span id={`style_desktop_${id}`} />
	<span id={`style_tablet_${id}`} />
	<span id={`style_mobile_${id}`} />
</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={Component}
	class={`${classname} ${id} element`}
	use:asDropZone={{
		TypesToAccept: { element: 'copy' },
		onDrop
	}}
	on:click={(e) => {
		selectedElement = id;
		customStyleContext.set({ style, id });
		e.stopPropagation();
	}}
	use:cssVariables={{ style, id }}
	{id}
>
	{#if children.length > 0 && childEnabled}
		{#each children as child}
			<svelte:self
				bind:id={child.id}
				bind:Component={child.Component}
				bind:children={child.children}
				bind:hierarchy={child.hierarchy}
				bind:style={child.style}
				bind:classname={child.classname}
				bind:elementId={child.elementId}
				bind:content={child.content}
				bind:name={child.name}
				bind:childEnabled={child.childEnabled}
				bind:selectedElement
			/>
		{/each}
	{/if}
	{#if contentfulElement.includes(elementId)}
		{content}
		<textarea
			id={`textarea_${id}`}
			bind:value={content}
			disabled={!active}
			class="absolute top-0 left-0 w-full h-full {id}"
		/>
	{:else if children.length == 0}
		{name}
	{/if}
	{#if active}
		<Resizer bind:style bind:containerWidth bind:containerHeight {hierarchy} />
	{/if}
</svelte:element>

<style>
	textarea {
		position: absolute !important;
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
		transition: 0.2s ease-in-out outline;
		outline: 1px solid transparent;
		position: relative;
		width: 100%;
		height: max-content;
	}
	.element:hover {
		outline: 1px solid lightseagreen;
	}
</style>
