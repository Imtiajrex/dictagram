<script>
	import { Transition } from '@rgossiaux/svelte-headlessui';
	export let show = false;
</script>

<Transition
	{show}
	enter="transition duration-75"
	enterFrom="translate-x-96"
	enterTo="translate-x-0"
	leave="transition-opacity duration-150"
	leaveFrom="opacity-100"
	leaveTo="opacity-0"
>
	<div class="  max-w-xs w-full h-full absolute right-0 top-0 rounded-l-xl bg-white" />
</Transition>
