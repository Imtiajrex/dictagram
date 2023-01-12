<script>
	import Drawer from './drawer.svelte';

	export let show = false;
</script>

{#if show}
	<Drawer className={'top-0 right-0 rounded-l-lg max-w-xs'} x={500}>Adjustments</Drawer>
{/if}
