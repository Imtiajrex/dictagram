<script lang="ts">
	import type { elementType, hierarchyType, styleType } from '$lib/utils/elements';
	import { onMount } from 'svelte';
	import Resizer from './resizer.svelte';

	export let name: string;
	export let Component: any;
	export let id: string;
	export let elementId: string;
	export let classname: string = '';
	export const style: styleType = {
		desktop: '',
		mobile: '',
		tablet: ''
	};
	export let content: string = '';
	export let hierarchy: hierarchyType;
	export const children: elementType[] = [];
	export let selectedElement: string;

	let defaultWidth: number, defaultHeight: number;
	let customPadding = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20
	};
	onMount(() => {
		const component = document.getElementById(id) as Element;
		defaultWidth = component.getBoundingClientRect().width;
		defaultHeight = component.getBoundingClientRect().height;
	});
	$: active = selectedElement == id;

	$: customStyle = `position:relative;width:${defaultWidth}px;height:${defaultHeight}px;padding:${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px;`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={Component}
	style={customStyle}
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
		<Resizer bind:defaultWidth bind:defaultHeight bind:padding={customPadding} {hierarchy} />
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
