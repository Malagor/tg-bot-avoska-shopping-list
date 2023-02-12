import { getText, getUserId, sendMessage } from '../../helpers/context.helper.js';
import { shoppingListService } from '../../database/shopping-list.service.js';

export async function forwardMessageCommand(ctx) {
	try {
		const userId = getUserId(ctx);
		const listUuid = extractListId(getText(ctx));

		const list = await shoppingListService.getShoppingListByUuid(listUuid);

		if (!list) {
			console.log('Списко не найден');
		}

		const userUds = [...list.userIds, userId];

		await shoppingListService.updateUsers(listUuid, userUds);

		await sendApprovingMessage(ctx, list.name);
	} catch (e) {
		console.log(e);
	}
}

/**
 *
 * @param {string} text
 */
function extractListId(text) {
	return text.match(/idList:"(.*)"/)[1];
}

/**
 * \
 * @param ctx
 * @param {string} listName
 * @return {Promise<void>}
 */
async function sendApprovingMessage(ctx, listName) {
	const html = `Список ${listName} добавлен`;
	await sendMessage(ctx, html, { kbName: 'lists' });
}
