<script>
	// @ts-nocheck
	import Drawer from './drawer.svelte';

	export let show = false;
</script>

{#if show}
	<Drawer>Layers</Drawer>
{/if}
