import { getUserId, sendMessage } from '../../helpers/context.helper.js';
import { shoppingListService } from '../../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';
import { KEYBOARD_BUTTON as kb } from '../../constants/keyboard.constants.js';
import { moveCurrentToTop } from '../../helpers/shopping-list.helper.js';

export async function showAllListsCommand(ctx) {
	const userId = getUserId(ctx);

	const lists = await shoppingListService.getAllShoppingListsByUserId(userId);

	if (!lists) {
		await sendMessage(ctx, 'У вас еще нет списков', { kbName: 'lists' });
	} else {
		await sendShoppingLists(ctx, lists);
	}
}

/**
 *
 * @param ctx
 * @param {Array<ShoppingList>}shoppingLists
 * @return {Promise<void>}
 */
async function sendShoppingLists(ctx, shoppingLists) {
	if (!shoppingLists.length) {
		await sendMessage(ctx, `У вас нет списков. Список можно создать командой "<b>${kb.newList}</b>"`, {
			kbName: 'lists',
		});
		return;
	}

	await sendMessage(ctx, `Общее количество ваших списков: "<b>${shoppingLists.length}</b>"`, { kbName: 'lists' });

	const currentListId = ctx.session[SESSION_FIELDS.CurrentListId];
	const userId = ctx.session[SESSION_FIELDS.UserId];

	const sortedList = moveCurrentToTop(shoppingLists, currentListId);

	for (const list of sortedList) {
		if (list?.toHtml) {
			const html = list.toHtml(currentListId, userId);

			await sendMessage(ctx, html, { kbName: 'shoppingList', list, userId, currentListId });
		}
	}
}
