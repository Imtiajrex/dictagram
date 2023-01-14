import type { customStyleType, styleObjectType } from './elements';

type variableObjectType = {
	[key: string]: string;
};
const updateVariables = (
	styleObject: styleObjectType,
	variables: variableObjectType,
	prefix: string
) => {
	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === 'object') updateVariables(value, variables, `${prefix}-${key}`);
		else variables[`${prefix}-${key}`] = value;
	}
};
const updateCssVariables = (style: customStyleType, variables: variableObjectType) => {
	updateVariables(style.desktop, variables, 'desktop');
	updateVariables(style.tablet, variables, 'tablet');
	updateVariables(style.mobile, variables, 'mobile');
};

export function cssVariables(node: HTMLElement, style: customStyleType) {
	const variables = {} as variableObjectType;
	updateCssVariables(style, variables);
	setCssVariables(node, variables);

	return {
		update(style: customStyleType) {
			const variables = {} as variableObjectType;
			updateCssVariables(style, variables);

			setCssVariables(node, variables);
		}
	};
}
function setCssVariables(node: HTMLElement, variables: variableObjectType) {
	for (const name in variables) {
		node.style.setProperty(`--${name}`, variables[name]);
	}
}
