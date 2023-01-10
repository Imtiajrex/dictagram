<script>
	import { Plus } from 'tabler-icons-svelte';
	import Button from '../button.svelte';
	const sites = [
		{
			name: ''
		}
	];
</script>

<div class="mt-24">
	<div class="flex items-center">
		<h3 class="text-3xl font-bold ">My Sites</h3>
		<Button className="ml-3">
			Add new site <Plus />
		</Button>
	</div>
</div>
