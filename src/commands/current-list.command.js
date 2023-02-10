import { shoppingListService } from '../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';
import { sendMessage } from '../helpers/context.helper.js';
import { KEYBOARD_BUTTON as kb } from '../constants/keyboard.constants.js';
import { formatListInfoHTML } from '../formatters/format-shopping-lists.js';

export async function currentListCommand(ctx) {
	const { session } = ctx;

	const list = await shoppingListService.getShoppingListByUuid(session[SESSION_FIELDS.ShoppingListId]);

	if (!list) {
		await sendMessage(
			ctx,
			`Не выбран текущий список. Воспользуйтесь командой "<b>${kb.ShowAllLists}</b>" и установите там текущий список`,
			{ kbName: 'lists' }
		);

		return;
	}

	await sendMessage(ctx, `<b>${formatListInfoHTML(list)}</b>`, { kbName: 'current', kbArgs: list.uuid });
}
