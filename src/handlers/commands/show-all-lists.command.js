import { getUserId, sendMessage } from '../../helpers/context.helper.js';
import { shoppingListService } from '../../database/shopping-list.service.js';
import { formatListInfoHTML } from '../../formatters/format-shopping-lists.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';
import { KEYBOARD_BUTTON as kb } from '../../constants/keyboard.constants.js';

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
		await sendMessage(ctx, `У вас нет списков. Список можно создать командой "<b>${kb.NewList}</b>"`, {
			kbName: 'lists',
		});
		return;
	}

	await sendMessage(ctx, `Общее количество ваших списков: "<b>${shoppingLists.length}</b>"`, { kbName: 'lists' });

	for (const list of shoppingLists) {
		const html = formatListInfoHTML(list, { isCurrent: isCurrent(ctx, list) });

		await sendMessage(ctx, html, { kbName: 'shoppingList', kbArgs: list.uuid });
	}
}

/**
 *
 * @param ctx
 * @param {ShoppingList} list
 */
function isCurrent(ctx, list) {
	const { session } = ctx;

	return session[SESSION_FIELDS.CurrentListId] === list.uuid;
}
