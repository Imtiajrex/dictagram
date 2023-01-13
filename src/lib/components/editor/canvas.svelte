<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { asDraggable, asDropZone } from 'svelte-drag-and-drop-actions';
	import type { DropOperation } from 'svelte-drag-and-drop-actions';
	import {
		addElement,
		getElements,
		type elementsKeyListType,
		type elementsType,
		type styleType
	} from '$lib/utils/elements';
	import Element from './element.svelte';

	let device = getContext('active-device-size') as Writable<string>;
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	let customStyleContext = getContext('custom-style') as Writable<styleType | null>;
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
	const elements = getElements() as elementsType;
	let selectedElement: string = '';
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
		selectedElement = '';
		customStyleContext.set(null);
		e.stopPropagation();
	}}
	class={`overflow-auto relative w-full h-full bg-white border-2 border-primary mx-auto rounded-md ${sizes[$device]}`}
>
	{#if $elements}
		{#each $elements as { id, Component, children, hierarchy, style, classname, elementId, content, name }}
			<Element
				bind:id
				bind:Component
				bind:children
				bind:hierarchy
				bind:style
				bind:classname
				bind:elementId
				bind:content
				bind:name
				bind:selectedElement
			/>
		{/each}
	{/if}
</div>
