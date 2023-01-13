<script lang="ts">
	import type { elementType, hierarchyType } from '$lib/utils/elements';
	import { onMount } from 'svelte';
	import { asDraggable } from 'svelte-drag-and-drop-actions';
	import Resizer from './resizer.svelte';

	export let name: string;
	export let Component: any;
	export let id: string;
	export let elementId: string;
	export let classname: string = '';
	export const style: {
		desktop?: string;
		mobile?: string;
		tablet?: string;
	} = {
		desktop: '',
		mobile: '',
		tablet: ''
	};
	export let content: string = '';
	export const hierarchy: hierarchyType = [];
	export const children: elementType[] = [];
	export let selectedElement: string;

	let defaultWidth: number, defaultHeight: number;
	onMount(() => {
		const component = document.getElementById(id) as Element;
		defaultWidth = component.getBoundingClientRect().width;
		defaultHeight = component.getBoundingClientRect().height;
	});
	$: active = selectedElement == id;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={Component}
	style={`position:relative;width:${defaultWidth}px;height:${defaultHeight}px;`}
	class={`${classname} ${elementId}`}
	on:click={(e) => {
		selectedElement = id;
		e.stopPropagation();
	}}
	{id}
>
	{#if content}
		<textarea bind:value={content} disabled={!active} />
	{:else}
		{name}
	{/if}
	{#if active}
		<Resizer bind:defaultWidth bind:defaultHeight />
	{/if}
</svelte:element>

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
