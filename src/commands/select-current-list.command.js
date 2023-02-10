import { getAdditionDataFromQuery, sendMessage } from '../helpers/context.helper.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

export async function selectCurrentList(ctx) {
	try {
		const listUuid = getAdditionDataFromQuery(ctx);

		if (!listUuid) {
			await sendMessage(ctx, 'Не получен идентификатор списка в сообщении', {
				kbName: 'lists',
				kbArgs: listUuid,
			});
		}

		const list = await shoppingListService.getShoppingListByUuid(listUuid);

		ctx.session[SESSION_FIELDS.ShoppingListId] = list.uuid;

		await sendMessage(ctx, `Список <b>${list.name}</b> теперь текущий.`, { kbName: 'lists', kbArgs: list.uuid });
	} catch (e) {
		console.log(e);
	}
}
