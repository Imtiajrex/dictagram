<script lang="ts">
	import { removeElement, type customStyleType, type hierarchyType } from '$lib/utils/elements';

	import { asDraggable } from 'svelte-drag-and-drop-actions';
	/**** map all touch events to mouse events ****/

	import mapTouchToMouseFor from 'svelte-touch-to-mouse';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import { Trash } from 'tabler-icons-svelte';

	export let containerWidth: number, containerHeight: number;
	let padding = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	} as { [key in 'top' | 'bottom' | 'left' | 'right']: number };
	export let style: customStyleType;

	let resizing = false;
	let paddingResizing = false;
	export let hierarchy = [] as hierarchyType;
	let initialX: number, initialY: number, initialWidth: number, initialHeight: number;
	let initialPadX: number,
		initialPadY: number,
		initialPadding = {} as { [key in 'top' | 'bottom' | 'left' | 'right']: number };

	mapTouchToMouseFor('.resizer');

	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	/**** Svelte Event Handling ****/
	type paddingTypes = 'top' | 'right' | 'bottom' | 'left' | 'all';

	onMount(() => {
		getPadding();
	});
	function getPadding() {
		if (style[$device]['padding']) {
			String(style[$device]['padding'])
				.split(' ')
				.forEach((p, i) => {
					p.replace('px', '');
					padding[dirIndex[i]] = parseInt(p);
				});
		}
	}
	function onDragMove(x: number, y: number, dir: paddingTypes) {
		if (resizing) {
			if (dir == 'top' || dir == 'bottom' || dir == 'all') {
				const height = initialHeight + (y - initialY) * (dir == 'top' ? -1 : 1);
				containerHeight = height;
				style[$device]['min-height'] = height + 'px';
			}
			if (dir == 'left' || dir == 'right' || dir == 'all') {
				const width = initialWidth + (x - initialX) * (dir == 'left' ? -1 : 1);
				containerWidth = width;
				style[$device]['max-width'] = width + 'px';
			}
		} else {
			initialX = x;
			initialY = y;
			initialWidth = containerWidth;
			initialHeight = containerHeight;
			resizing = true;
		}
	}
	function onDragEnd() {
		resizing = false;
		paddingResizing = false;
	}
	const dirIndex = ['top', 'right', 'bottom', 'left'] as ('top' | 'right' | 'bottom' | 'left')[];
	function onDragPadResizer(x: number, y: number, dir: paddingTypes) {
		if (paddingResizing) {
			if (dir == 'all') {
				padding['top'] = Math.max(0, initialPadding['top'] - (y - initialPadY));
				padding['right'] = Math.max(0, initialPadding['right'] - (x - initialPadX));
				padding['bottom'] = Math.max(0, initialPadding['bottom'] - (y - initialPadY));
				padding['left'] = Math.max(0, initialPadding['left'] - (x - initialPadX));
			} else if (dir == 'top' || dir == 'bottom') {
				padding[dir] = Math.max(
					0,
					initialPadding[dir] - (y - initialPadY) * (dir == 'top' ? -1 : 1)
				);
			} else if (dir == 'left' || dir == 'right') {
				padding[dir] = Math.max(
					0,
					initialPadding[dir] - (x - initialPadX) * (dir == 'left' ? -1 : 1)
				);
			}
			style[$device][
				'padding'
			] = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
		} else {
			getPadding();
			initialPadding['top'] = padding.top;
			initialPadding['right'] = padding.right;
			initialPadding['bottom'] = padding.bottom;
			initialPadding['left'] = padding.left;

			initialPadX = x;
			initialPadY = y;

			paddingResizing = true;
		}
	}

	const dir = ['top', 'right', 'bottom', 'left', 'all'] as paddingTypes[];
	const dirClassResizer = {
		top: 'bg-accent top-0 left-0 w-full h-0.5',
		right: 'bg-accent top-0 right-0 w-0.5 h-full',
		bottom: 'bg-accent left-0 bottom-0  w-full h-0.5',
		left: 'bg-accent top-0 left-0 w-0.5 h-full',
		all: 'bg-white border-2 border-solid border-black -bottom-0.5 -right-0.5 w-4 h-4 rounded-full'
	};
	const cursorClass = {
		top: 'cursor-n-resize',
		right: 'cursor-e-resize',
		bottom: 'cursor-s-resize',
		left: 'cursor-w-resize',
		all: 'cursor-se-resize'
	} as { [key in paddingTypes]: string };
	$: paddedWidth = `100cqw`;
	$: paddedHeight = `calc(100% - ${padding.top + padding.bottom}px)`;
	$: paddingResizerStyle = {
		top: `top: ${padding.top}px;left:${padding.left}px;width: ${paddedWidth};height: 2px;`,
		bottom: `bottom: ${padding.bottom}px;left:${padding.left}px;width: ${paddedWidth};height: 2px;`,
		left: `left: ${padding.left}px;top: ${padding.top}px;height: ${paddedHeight};width: 2px;`,
		right: `right: ${padding.right}px;top: ${padding.top}px;height: ${paddedHeight};width: 2px;`,
		all: `bottom: ${padding.bottom - 3}px;right: ${
			padding.right - 3
		}px;width: 8px;height: 8px;border-radius: 50%;border: 2px solid black; background:white`
	} as { [key in paddingTypes]: string };
	const remove = () => {
		removeElement({
			hierarchy
		});
	};
</script>

{#each dir as d}
	<div
		class="resizer padding absolute bg-black {cursorClass[d]}"
		style={paddingResizerStyle[d]}
		use:asDraggable={{
			onDragMove: (x, y) => onDragPadResizer(x, y, d),
			onDragEnd
		}}
	/>
{/each}
{#each dir as d}
	<div
		class="resizer absolute {dirClassResizer[d]} {cursorClass[d]}"
		use:asDraggable={{
			onDragMove: (x, y) => onDragMove(x, y, d),
			onDragEnd
		}}
	/>
{/each}
<button
	class="w-6 h-6 rounded-lg bg-red-700 shadow-sm flex justify-center items-center absolute top-1 right-1 text-white"
	on:click={remove}
>
	<Trash size={18} />
</button>
