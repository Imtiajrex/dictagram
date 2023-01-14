import type { styleObjectType } from './elements';

export const styleObjectToCSS = (styleObject: styleObjectType): string => {
	let css = '';
	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === 'object') css += `${key} { ${styleObjectToCSS(value)} }`;
		else css += `${key}: ${value};`;
	}
	return css;
};
export const styleObjectToCssVariable = (styleObject: styleObjectType, prefix: string): string => {
	let css = '';
	for (const [key] of Object.entries(styleObject)) {
		css += `${key}: var(--${prefix}-${key});`;
	}
	return css;
};
