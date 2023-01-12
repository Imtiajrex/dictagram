<script lang="ts">
	import { Container, CursorText, Heading, LayoutGrid, type TablerIcon } from 'tabler-icons-svelte';
	import Drawer from './drawer.svelte';
	import ElementCard from './element-card.svelte';

	export let show = false;
	const elements = [
		{ Icon: Heading, name: 'Heading' },
		{ Icon: CursorText, name: 'Paragraph' },
		{ Icon: Container, name: 'Container' },
		{ Icon: LayoutGrid, name: 'Grid' }
	] as { Icon: any; name: string }[];
</script>

{#if show}
	<Drawer>
		<h3 class="text-xl">Elements</h3>
		<div class="flex justify-between gap-3 flex-wrap mt-5">
			{#each elements as element}
				<ElementCard {...element} />
			{/each}
		</div>
	</Drawer>
{/if}
