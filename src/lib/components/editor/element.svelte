<script lang="ts">
	import './element.css';
	import {
		type elementType,
		type hierarchyType,
		type customStyleType,
		type elementsKeyListType,
		addElement,
		getSelectedElement
	} from '$lib/utils/elements';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Unsubscriber, Writable } from 'svelte/store';
	import Resizer from './resizer.svelte';
	import * as _ from 'lodash';
	import { cssVariables } from '$lib/utils/cssVariables';
	import {
		styleObjectToCSS,
		styleObjectToVariableBasedCss,
		styleObjectToCssVariables
	} from '$lib/utils/styleCompiler';
	import {
		asDraggable,
		asDroppable,
		asDropZone,
		type DropOperation,
		type Position
	} from 'svelte-drag-and-drop-actions';
	import { DragDrop } from 'tabler-icons-svelte';
	import { cloneDeep } from 'lodash';
	let selectedElement = getSelectedElement() as Writable<string>;
	export let element: elementType;
	$: ({
		name,
		Component,
		id,
		elementId,
		style,
		classname,
		childEnabled,
		hierarchy,
		children,
		content
	} = element);

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

		updateDeviceStyles();
	});
	const getWidthHeight = () => {
		elementComponent = document.getElementById(id) as HTMLElement;
		if (elementComponent) {
			containerWidth = elementComponent.getBoundingClientRect().width;
			containerHeight = elementComponent.getBoundingClientRect().height;
		}
	};

	let varStyle = '';
	let desktopStyle = '';
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
	const updateDeviceStyles = () => {
		varStyle = '';
		['desktop', 'tablet', 'mobile'].forEach((device) => {
			const val = device as 'desktop' | 'tablet' | 'mobile';
			const { css, variables } = styleObjectToVariableBasedCss(style[val], `${id}-${device}`);

			varStyle += variables;
			updateStyle(css, device);
		});
	};
	$: {
		if (style) updateDeviceStyles();
	}
	$: active = $selectedElement == id;
	let movingElement = getContext('moving-element') as Writable<hierarchyType>;
	const contentfulElement = ['heading', 'paragraph'];
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	const onDrop = (x: number, y: number, Operation: DropOperation, DataOffered: any) => {
		if (!childEnabled) return 'not-allowed';

		if (childMoving) return 'not-allowed';
		addElement({
			elementID: DataOffered.element as elementsKeyListType,
			hierarchy: [...hierarchy]
		});
		tool.set(null);
		return DataOffered.element;
	};
	let isHovering = false;
	export let canvasSize = {
		width: 0,
		height: 0
	};
	let moving = false;
	let initialMargin = {
		x: 0,
		y: 0
	};
	const startDrag = () => {
		movingElement.set(hierarchy);
	};
	const moveElement = (x: number, y: number) => {
		style[$device]['margin-left'] = x + 'px';
		style[$device]['margin-top'] = y + 'px';
	};
	let childMoving = false;
	$: {
		const droppedHierarchy = cloneDeep($movingElement);
		droppedHierarchy.pop();
		childMoving =
			droppedHierarchy.length === hierarchy.length &&
			droppedHierarchy.every((value, index) => value === hierarchy[index]);
	}
</script>

<span class="h-0 opacity-0 absolute">
	<span id={`style_desktop_${id}`} />
	<span id={`style_tablet_${id}`} />
	<span id={`style_mobile_${id}`} />
</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<svelte:element
	this={Component}
	class={`${classname} ${id} element`}
	use:asDropZone={{
		TypesToAccept: { element: 'copy' },
		onDrop
	}}
	use:asDraggable={{
		onDragMove: moveElement,

		onlyFrom: '.handle',
		onDragEnd: () => {
			movingElement.set([]);
		}
	}}
	on:dragstart={startDrag}
	use:asDroppable={{
		DataToOffer: { element: elementId }
	}}
	on:click={(e) => {
		$selectedElement = id;
		customStyleContext.set({ style, id });
		e.stopPropagation();
	}}
	on:mouseover|stopPropagation={() => (isHovering = true)}
	on:mouseout|stopPropagation={() => (isHovering = false)}
	style={`${varStyle}${isHovering ? 'outline: 1px solid seagreen;' : ''}${
		childMoving && 'max-height:' + `var(--${id}-${$device}-min-height)`
	}`}
	{id}
>
	{#if children && children.length > 0 && childEnabled}
		{#each children as child}
			<svelte:self bind:element={child} {canvasSize} />
		{/each}
	{/if}
	{#if contentfulElement.includes(elementId)}
		{content}
		<textarea
			id={`textarea_${id}`}
			bind:value={content}
			disabled={!active}
			class="absolute top-0 left-0 w-full h-full {id}"
			style="margin:0"
		/>
	{:else if !children || (children && children.length == 0)}
		{name}
	{/if}
	{#if active}
		<Resizer bind:style bind:containerWidth bind:containerHeight {hierarchy} {canvasSize} />
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
</style>
