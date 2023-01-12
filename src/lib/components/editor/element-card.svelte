<script>
	import { AlignCenter } from 'tabler-icons-svelte';

	export let Icon = AlignCenter;
	export let name = '';
</script>

<div
	class=" transition group hover:bg-primary select-none rounded-md bg-white p-3 w-24 h-24 flex flex-col justify-center items-center cursor-move"
>
	<Icon size={25} class={' transition group-hover:text-white '} />
	<div class="transition text-xs text-center font-semibold mt-2 group-hover:text-white  ">
		{name}
	</div>
</div>
