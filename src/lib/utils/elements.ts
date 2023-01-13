import { getContext, setContext } from 'svelte';
import { SvelteElement } from 'svelte/internal';
import { get, writable, type Writable } from 'svelte/store';
import { Container, CursorText, Heading, LayoutGrid } from 'tabler-icons-svelte';

export const elementsList = [
	{ Icon: Heading, name: 'Heading' },
	{ Icon: CursorText, name: 'Paragraph' },
	{ Icon: Container, name: 'Container' },
	{ Icon: LayoutGrid, name: 'Grid' }
] as { Icon: any; name: string }[];

export type elementsKeyListType = 'heading' | 'paragraph' | 'container' | 'grid';
export type hierarchyType = string[];
export type styleType = {
	desktop?: string;
	mobile?: string;
	tablet?: string;
};
export type elementType = {
	name: string;
	Component: any;
	id: string;
	elementId: string;
	classname?: string;
	style?: styleType;
	content?: string;
	hierarchy: hierarchyType;
	children: elementType[];
};
export type elementsType = Writable<elementType[]>;
const elements = writable<elementType[]>([]);
const elementsMap = {
	heading: {
		name: 'Heading',
		Component: 'h1',
		content: 'This is a heading'
	},
	paragraph: {
		name: 'Paragraph',
		Component: 'p',
		content: 'This is a paragraph. It is used to write large chunks of text.'
	},
	container: {
		name: 'Container',
		Component: 'div',
		classname: 'container'
	},
	grid: {
		name: 'Grid',
		Component: 'div',
		classname: 'grid'
	}
} as { [key in elementsKeyListType]: elementType };

export const getElements = () => getContext('elements');
export const setElements = () => setContext('elements', elements);

export const getElement = ({
	elements,
	hierarchy = []
}: {
	elements: elementType[];
	hierarchy: hierarchyType;
}) => {
	console.log(elements);
};
const usedIds = [] as string[];
const generateID = (): string => {
	let id = Math.random().toString(36).substring(2, 9);
	if (usedIds.includes(id)) id = generateID();
	usedIds.push(id);
	return id;
};
export const addElement = ({
	elementID,
	hierarchy = []
}: {
	elementID: elementsKeyListType;
	hierarchy?: hierarchyType;
}) => {
	if (hierarchy.length === 0) {
		const element = { ...elementsMap[elementID] };
		element.id = elementID + '_' + generateID();
		element.elementId = elementID;
		element.hierarchy = [element.id];
		elements.update((elements) => {
			return [...elements, element];
		});
		return;
	}
};

export const assignElement = ({
	element,
	hierarchy = []
}: {
	element: elementType;
	hierarchy: hierarchyType;
}) => {
	console.log(element);
};
export const removeElement = ({ hierarchy }: { hierarchy: hierarchyType }) => {
	console.log(hierarchy);
	elements.update((elements) => {
		return elements.filter((element) => element.id !== hierarchy[0]);
	});
};
