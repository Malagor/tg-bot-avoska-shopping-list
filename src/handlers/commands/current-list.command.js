import { shoppingListService } from '../../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';
import { sendMessage } from '../../helpers/context.helper.js';
import { KEYBOARD_BUTTON as kb } from '../../constants/keyboard.constants.js';

export async function currentListCommand(ctx) {
	const { session } = ctx;

	const currentListId = session[SESSION_FIELDS.CurrentListId];

	const list = await shoppingListService.getShoppingListByUuid(currentListId);

	if (!list) {
		await sendMessage(
			ctx,
			`Не выбран текущий список. Воспользуйтесь командой "<b>${kb.showAllLists}</b>" и установите там текущий список`,
			{ kbName: 'lists' }
		);

		return;
	}

	const userId = session[SESSION_FIELDS.UserId];

	await sendMessage(ctx, `<b>${list.toHtml(currentListId)}</b>`, { kbName: 'current', list, userId });
}
