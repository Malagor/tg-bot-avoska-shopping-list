import { formatProductText } from './format-product-list.js';

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
export function formatInlineQueryAnswer(lists) {
	return lists.map((l, id) => {
		const productList = l.products.map(pr => formatProductText(pr)).join('\n') || 'Нет продуктов для обображения';

		return {
			id: id + 1,
			type: 'article',
			title: `${l.name} (${l.products.length})`,
			input_message_content: {
				message_text: `Список: ${l.name}:\n` + productList,
			},
		};
	});
}
