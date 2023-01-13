<script>
	// @ts-nocheck

	import { asDraggable } from 'svelte-drag-and-drop-actions';

	export let defaultWidth, defaultHeight;

	let resizing = false;
	let initialX, initialY, initialWidth, initialHeight;

	/**** map all touch events to mouse events ****/

	import mapTouchToMouseFor from 'svelte-touch-to-mouse';
	mapTouchToMouseFor('.resizer');

	/**** Svelte Event Handling ****/

	function onDragMove(x, y, dir) {
		if (resizing) {
			console.log('resizing');
			if (dir == 'top' || dir == 'bottom' || dir == 'all')
				defaultHeight = initialHeight + (y - initialY) * (dir == 'top' ? -1 : 1);

			if (dir == 'left' || dir == 'right' || dir == 'all')
				defaultWidth = initialWidth + (x - initialX) * (dir == 'left' ? -1 : 1);
		} else {
			initialX = x;
			initialWidth = defaultWidth;
			initialY = y;
			initialHeight = defaultHeight;
			resizing = true;
		}
	}
	function onDragEnd() {
		resizing = false;
	}
</script>

<div
	class="resizer bg-accent absolute bottom-0 w-full h-0.5 cursor-s-resize"
	use:asDraggable={{
		onDragMove: (x, y) => onDragMove(x, y, 'bottom'),
		onDragEnd
	}}
	on:dragstart|stopPropagation
	on:dragend|stopPropagation
/>
<div
	class="resizer bg-accent absolute top-0 w-full h-0.5 cursor-s-resize"
	use:asDraggable={{
		onDragMove: (x, y) => onDragMove(x, y, 'top'),
		onDragEnd
	}}
	on:dragstart|stopPropagation
	on:dragend|stopPropagation
/>
<div
	class="resizer bg-accent absolute top-0 right-0 w-0.5 h-full cursor-e-resize"
	use:asDraggable={{
		onDragMove: (x, y) => onDragMove(x, y, 'right'),
		onDragEnd
	}}
	on:dragstart|stopPropagation
	on:dragend|stopPropagation
/>
<div
	class="resizer bg-accent absolute top-0 left-0 w-0.5 h-full cursor-w-resize"
	use:asDraggable={{
		onDragMove: (x, y) => onDragMove(x, y, 'left'),
		onDragEnd
	}}
	on:dragstart|stopPropagation
	on:dragend|stopPropagation
/>

<div
	class="resizer bg-white border-2 border-solid border-black absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full cursor-se-resize"
	use:asDraggable={{
		onDragMove: (x, y) => onDragMove(x, y, 'all'),
		onDragEnd
	}}
	on:dragstart|stopPropagation
	on:dragend|stopPropagation
/>
