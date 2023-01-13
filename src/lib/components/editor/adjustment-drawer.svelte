<script lang="ts">
	import type { styleType } from '$lib/utils/elements';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Drawer from './drawer.svelte';

	export let show = false;

	let customStyleContext = getContext('custom-style') as Writable<styleType | null>;
</script>

{#if show}
	<Drawer className={'top-0 right-0 rounded-l-lg max-w-xs'} x={500}>
		<h5 class="text-xl font-bold">Adjustments</h5>
		{#if $customStyleContext}
			<h6 class="text-lg font-bold">Desktop</h6>
			<input bind:value={$customStyleContext.desktop} />
			<h6 class="text-lg font-bold">Mobile</h6>
			<input bind:value={$customStyleContext.mobile} />
			<h6 class="text-lg font-bold">Tablet</h6>
			<input bind:value={$customStyleContext.tablet} />
		{/if}
	</Drawer>
{/if}
