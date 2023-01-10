<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let device = getContext('active-device-size') as Writable<string>;
	const sizes = {
		desktop: 'max-w-screen-2xl',
		tablet: 'max-w-screen-md',
		mobile: 'max-w-md'
	} as { [key: string]: string };
</script>

<div
	class={`  w-full h-full bg-white border-2 border-primary mx-auto rounded-md ${sizes[$device]}`}
/>
