<script lang="ts">
	import ToolsDrawer from '$lib/components/editor/tools-drawer.svelte';
	import Tools from '$lib/components/editor/tools.svelte';
	import Header from '$lib/components/header/header.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { toolType } from '$lib/components/types/editor/toolType';
	import Canvas from '$lib/components/editor/canvas.svelte';
	import {
		getElements,
		setElements,
		type elementsType,
		type customStyleType
	} from '$lib/utils/elements';
	import { onDestroy } from 'svelte';
	import Element from '$lib/components/editor/element.svelte';

	type deviceSizesType = 'desktop' | 'tablet' | 'mobile';
	setContext('active-tool-drawer', writable<toolType>(null));
	setContext('active-device-size', writable<deviceSizesType>('desktop'));
	setContext('custom-style', writable<customStyleType | null>(null));
	setContext('adjustments-active', writable(false));
	setElements();
	let elements = getElements() as elementsType;
	onDestroy(() => {
		$elements = [];
	});
	let selectedElement = '';
</script>

<div class="p-5 py-0 h-28">
	<Header editor />
	<Tools />
</div>
<div class="relative w-full h-full overflow-hidden p-2" style="height:88%">
	<Canvas />

	<ToolsDrawer />
</div>
<div class="min-h-screen p-10">
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
