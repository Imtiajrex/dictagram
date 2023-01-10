<script lang="ts">
	import { getContext } from 'svelte';
	import ElementDrawer from './element-drawer.svelte';
	import LayerDrawer from './layer-drawer.svelte';
	import AdjustmentDrawer from './adjustment-drawer.svelte';
	import type { Writable } from 'svelte/store';
	import type { toolType } from '../types/editor/toolType';
	let tool = getContext('active-tool-drawer') as Writable<toolType>;
	let adjustment = getContext('adjustments-active') as Writable<boolean>;
	const ToolDrawer = {
		add: ElementDrawer,
		layer: LayerDrawer
	};
	$: console.log($tool);
	$: Drawer = $tool ? ToolDrawer[$tool] : null;
	$: $tool && console.log(ToolDrawer[$tool]);
</script>

{#if Drawer != null}
	<Drawer />
{/if}
<AdjustmentDrawer bind:show={$adjustment} />
