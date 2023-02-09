import { productListService } from '../database/product-list.service.js';
import { formatProductListWithButtons, formatSimpleProductList } from '../formatters/format-product-list.js';
import { getUserId, getUserName } from '../helpers/context.helper.js';
import { mainKeyboard } from '../keyboards/keyboards.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

/**
 *
 * @param ctx
 * @param {{isBuyMode: boolean}}options
 * @return {Promise<void>}
 */
export async function listCommand(ctx, { isBuyMode }) {
	try {
		const userId = getUserId(ctx);
		const listUuid = ctx.session[SESSION_FIELDS.ShoppingListId];
		let list = await getShoppingList(listUuid, userId);

		if (!list) {
			list = await createNewShoppingList(ctx, userId);

			if (!list) {
				sendMessage(ctx, `Не удалось получить или создать список для пользователя. Попробуйте позже`);
				return;
			}
		}

		saveShoppingListId(ctx, list.uuid);

		if (!list.products.length) {
			sendMessage(ctx, 'Нет списка продуктов для отображения');
			return;
		}

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
 * @param {string} listUuid
 * @param {number} userId
 * @return {Promise<ProductList>}
 */
async function getShoppingList(listUuid, userId) {
	return listUuid
		? productListService.getProductListByUuid(listUuid)
		: productListService.getProductListByUserId(userId);
}

/**
 *
 * @param ctx
 * @param {number} userId
 * @return {Promise<ProductList>}
 */
async function createNewShoppingList(ctx, userId) {
	console.log('Не удалось найти список продуктов. Создаю новый!');
	const userName = getUserName(ctx);

	return productListService.createList(`Спискок пользователя ${userName}`, userId);
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
 * @param {string} text
 */
function sendMessage(ctx, text) {
	ctx.reply(text, {
		reply_markup: mainKeyboard,
	});
}
