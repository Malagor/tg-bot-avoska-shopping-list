import { sendMessage } from './context.helper.js';
import { formatProductHTML } from '../formatters/format-product-list.js';

/**
 *
 * @param ctx
 * @param {Array<Product>}products
 */
export async function sendProductListWithButtons(ctx, products) {
	for (const product of products) {
		await sendProductWithButtons(ctx, product);
	}
}

/**
 *
 * @param ctx
 * @param {Array<Product>}products
 * @return {Promise<void>}
 */
export async function sendSimpleProductList(ctx, products) {
	let html = '';

	for (const product of products) {
		html += formatProductHTML(product) + '\n';
	}

	if (!html) {
		html = 'Нет продуктов для отображения';
	}

	await ctx.replyWithHTML(html, {
		disable_notification: true,
	});
}

/**
 * @param ctx
 * @param {Product} product
 */
async function sendProductWithButtons(ctx, product) {
	const html = formatProductHTML(product);

	await sendMessage(ctx, html, { kbName: 'product', kbArgs: product.uuid });
}
