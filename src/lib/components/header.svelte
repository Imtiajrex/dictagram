<script>
	import Logo from './logo.svelte';
	import { Help, Bell } from 'tabler-icons-svelte';
	const menuLinkClass = `text-primary cursor-pointer hover:text-accent transition`;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<header class="flex justify-between items-center min-w-full pt-5">
	<div class="ml-3 flex items-center">
		<Logo />
		<menu class="ml-7 flex items-center gap-2">
			<a href="" class={menuLinkClass}> Sites </a>
		</menu>
	</div>

	<div class="flex items-center justify-end  gap-3">
		<a class={menuLinkClass}>
			<Help />
		</a>
		<a class={menuLinkClass}>
			<Bell />
		</a>
		<a class="cursor-pointer outline-4 outline-primary">
			<img src="https://i.pravatar.cc/50" class="w-10 h-10 rounded-full" />
		</a>
	</div>
</header>
