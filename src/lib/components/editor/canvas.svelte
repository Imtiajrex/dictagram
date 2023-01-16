<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { asDraggable, asDropZone } from 'svelte-drag-and-drop-actions';
	import type { DropOperation } from 'svelte-drag-and-drop-actions';
	import {
		addElement,
		getElements,
		getSelectedElement,
		type elementsKeyListType,
		type elementsType,
		type hierarchyType
	} from '$lib/utils/elements';
	import type { customStyleType } from '$lib/utils/elements';
	import Element from './element.svelte';
	import { onMount } from 'svelte';
	let device = getContext('active-device-size') as Writable<string>;
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	let customStyleContext = getContext('custom-style') as Writable<customStyleType | null>;
	const sizes = {
		desktop: 'max-w-screen-2xl',
		tablet: 'max-w-screen-md',
		mobile: 'max-w-md'
	} as { [key: string]: string };
	function onDrop(x: number, y: number, Operation: DropOperation, DataOffered: any) {
		addElement({
			elementID: DataOffered.element as elementsKeyListType
		});
		tool.set(null);
		return DataOffered.element;
	}
	let canvas;
	let canvasSize = {
		width: 0,
		height: 0
	};
	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLElement;
		canvasSize = {
			width: canvas.getBoundingClientRect().width,
			height: canvas.getBoundingClientRect().height
		};
	});
	const elements = getElements() as elementsType;
	let selectedElement = getSelectedElement() as Writable<string>;
	let movingElement = writable<hierarchyType>([]);
	setContext('moving-element', movingElement);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	use:asDropZone={{
		TypesToAccept: { element: 'copy' },
		onDrop
	}}
	draggable="false"
	on:dragstart|preventDefault
	on:click={(e) => {
		$selectedElement = '';
		customStyleContext.set(null);
		e.stopPropagation();
	}}
	id="canvas"
	class={`canvas overflow-auto relative w-full h-full bg-white border-2 border-primary mx-auto rounded-md ${sizes[$device]}`}
>
	{#if $elements}
		{#each $elements as element}
			<Element bind:element {canvasSize} />
		{/each}
	{/if}
</div>

<style>
	.canvas {
		container-type: inline-size;
		container-name: canvas;
	}
</style>
