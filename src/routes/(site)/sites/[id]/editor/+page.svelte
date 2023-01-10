<script lang="ts">
	import ToolsDrawer from '$lib/components/editor/tools-drawer.svelte';
	import Tools from '$lib/components/editor/tools.svelte';
	import Header from '$lib/components/header/header.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { toolType } from '$lib/components/types/editor/toolType';
	import Canvas from '$lib/components/editor/canvas.svelte';

	type deviceSizesType = 'desktop' | 'tablet' | 'mobile';
	let tool = setContext('active-tool-drawer', writable<toolType>(null));
	let device = setContext('active-device-size', writable<deviceSizesType>('desktop'));
	let adjustments = setContext('adjustments-active', writable(false));
</script>

<div class="p-5 pt-0 h-32">
	<Header editor />
	<Tools />
</div>
<div class="relative w-full h-5/6 overflow-hidden">
	<Canvas />
	<ToolsDrawer />
</div>
