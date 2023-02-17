import { sendMessage } from './context.helper.js';

/**
 *
 * @param ctx
 * @param {Array<Product>}products
 */
export async function sendProductListWithActions(ctx, products) {
	for (const product of products) {
		await sendProductWithActions(ctx, product);
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
		html += product.toText() + '\n';
	}

	if (!html) {
		html = 'Нет продуктов для отображения';
	}

	await sendMessage(ctx, html);
}

/**
 * @param ctx
 * @param {Product} product
 */
async function sendProductWithActions(ctx, product) {
	const html = product.toHtml();

	await sendMessage(ctx, html, { kbName: 'product', product });
}

/**
 *
 * @param {Array<ShoppingList>} lists
 * @return {Array<{id: number,
			type: 'article',
			title: string,
			input_message_content: {
				message_text: string,
			}}>
			}
 */
export function getInlineQueryAnswer(lists) {
	return lists.map((list, idx) => list.toInlineQueryAnswer(idx));
}

export function moveCurrentToTop(list, currentId) {
	if (!currentId) {
		return list;
	}
	const index = list.findIndex(l => l.uuid === currentId);
	return [list[index], ...list.slice(0, index), ...list.slice(index + 1)];
}
