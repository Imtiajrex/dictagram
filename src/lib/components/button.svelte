<script lang="ts">
	export let className: string = '';
</script>

<button
	class={' bg-primary text-white px-7 py-4 flex items-center justify-center rounded-md hover:scale-105 active:scale-95 transition ' +
		className}
>
	<slot />
</button>
