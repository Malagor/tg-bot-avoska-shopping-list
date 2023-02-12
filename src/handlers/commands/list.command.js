import { shoppingListService } from '../../database/shopping-list.service.js';
import { sendProductListWithButtons, sendSimpleProductList } from '../../helpers/shopping-list.helper.js';
import * as helper from '../../helpers/context.helper.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';

/**
 *
 * @param {{isBuyMode}} option
 * @return {function(ctx)}
 */
export const getListCommandHandler =
	({ isBuyMode } = {}) =>
	async ctx => {
		try {
			const listUuid = ctx.session[SESSION_FIELDS.CurrentListId];

			let list = await shoppingListService.getShoppingListByUuid(listUuid);

			if (!list) {
				await helper.sendMessage(
					ctx,
					'Список не найден. Попробуйте создать список или назначить текущим из списка /showLists',
					{ kbName: 'main' }
				);

				return;
			}

			saveCurrentListId(ctx, list.uuid);

			if (!list.products.length) {
				await helper.sendMessage(ctx, 'Нет списка продуктов для отображения', { kbName: 'main' });
				return;
			}

			await sendListTitle(ctx, list);

			if (isBuyMode) {
				await sendProductListWithButtons(ctx, list.products);
			} else {
				await sendSimpleProductList(ctx, list.products);
			}
		} catch (e) {
			console.log(e);
		}
	};

/**
 *
 * @param ctx
 * @param {string} listUuid
 */
function saveCurrentListId(ctx, listUuid) {
	ctx.session[SESSION_FIELDS.CurrentListId] = listUuid;
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
