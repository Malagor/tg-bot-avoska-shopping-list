import { shoppingListService } from '../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';
import * as helper from '../helpers/context.helper.js';

export async function startCommand(ctx) {
	const { session } = ctx;

	const list = await shoppingListService.getShoppingListByUuid(session[SESSION_FIELDS.ShoppingListId]);
	if (!list) {
		await helper.sendMessage(
			ctx,
			'Список не найден. Попробуйте создать список или назначить текущим из списка /showLists',
			{ kbName: 'main' }
		);

		return;
	}

	ctx.session[SESSION_FIELDS.ShoppingListId] = list.uuid;

	await helper.sendMessage(ctx, 'Welcome', { kbName: 'main' });
}
