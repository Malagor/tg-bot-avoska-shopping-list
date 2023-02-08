/**
 *
 * @param ctx
 * @param {Array<{title: string, count: number}>}products
 */
import { getProductKeyboard } from '../keyboards/keyboards.js';

export async function formatProductList(ctx, products) {
	for (const product of products) {
		await formatProduct(ctx, product);
	}
}

/**
 * @param ctx
 * @param {{uuid: string, title: string, count: number}} product
 */
async function formatProduct(ctx, product) {
	const html = formatProductHTML(product);

	await ctx.replyWithHTML(html, {
		reply_markup: getProductKeyboard(product),
	});
}

/**
 * @param {{uuid: string, title: string, count: number}} product
 * @return {string}
 */
export function formatProductHTML(product) {
	return `<b>${product.title}</b> : ${product.count}`;
}

/**
 * @param {{uuid: string, title: string, count: number}} product
 * @return {string}
 */
export function formatProductText(product) {
	return `${product.title} : ${product.count}`;
}
