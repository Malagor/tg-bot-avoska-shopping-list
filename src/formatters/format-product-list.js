/**
 *
 * @param ctx
 * @param {Array<Product>}products
 */
import { getProductKeyboard } from '../keyboards/keyboards.js';

export async function formatProductListWithButtons(ctx, products) {
	for (const product of products) {
		await formatProductWithButtons(ctx, product);
	}
}

export async function formatSimpleProductList(ctx, products) {
	let html = '';

	for (const product of products) {
		html += formatProductHTML(product) + '\n';
	}

	await ctx.replyWithHTML(html);
}

/**
 * @param ctx
 * @param {{uuid: string, title: string, count: number}} product
 */
async function formatProductWithButtons(ctx, product) {
	const html = formatProductHTML(product);

	await ctx.replyWithHTML(html, {
		reply_markup: getProductKeyboard(product),
	});
}

/**
 * @param {Product} product
 * @return {string}
 */
export function formatProductHTML(product) {
	return `<b>${product.title}</b> : ${product.count}`;
}

/**
 * @param {Product} product
 * @return {string}
 */
export function formatProductText(product) {
	return `${product.title} : ${product.count}`;
}
