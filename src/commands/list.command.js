import { shoppingListService } from '../database/shopping-list.service.js';
import { formatProductListWithButtons, formatSimpleProductList } from '../formatters/format-product-list.js';
import * as helper from '../helpers/context.helper.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

/**
 *
 * @param ctx
 * @param {{isBuyMode: boolean}}options
 * @return {Promise<void>}
 */
export async function listCommand(ctx, { isBuyMode }) {
	try {
		const listUuid = ctx.session[SESSION_FIELDS.ShoppingListId];

		let list = await shoppingListService.getShoppingListByUuid(listUuid);

		if (!list) {
			await helper.sendMessage(
				ctx,
				'Список не найден. Попробуйте создать список или назначить текущим из списка /showLists',
				{ kbName: 'main' }
			);

			return;
		}

		saveShoppingListId(ctx, list.uuid);

		if (!list.products.length) {
			await helper.sendMessage(ctx, 'Нет списка продуктов для отображения', { kbName: 'main' });
			return;
		}

		await sendListTitle(ctx, list);

		if (isBuyMode) {
			await formatProductListWithButtons(ctx, list.products);
		} else {
			await formatSimpleProductList(ctx, list.products);
		}
	} catch (e) {
		console.log(e);
	}
}

/**
 *
 * @param ctx
 * @param {string} listUuid
 */
function saveShoppingListId(ctx, listUuid) {
	ctx.session[SESSION_FIELDS.ShoppingListId] = listUuid;
}

/**
 *
 * @param ctx
 * @param {ShoppingList} list
 * @return {Promise<void>}
 */
async function sendListTitle(ctx, list) {
	await helper.sendMessage(ctx, `Продукты из списка: "<b>${list.name}</b>"`, { kbName: 'main' });
}
