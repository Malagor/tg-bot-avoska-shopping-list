/**
 *
 * @param ctx
 * @param {Array<Product>}products
 */
import { sendMessage } from '../helpers/context.helper.js';

export async function formatProductListWithButtons(ctx, products) {
	for (const product of products) {
		await sendProductWithButtons(ctx, product);
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
async function sendProductWithButtons(ctx, product) {
	const html = formatProductHTML(product);

	await sendMessage(ctx, html, { kbName: 'product', kbArgs: product.uuid });
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
