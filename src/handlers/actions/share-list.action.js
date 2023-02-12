import { getAdditionDataFromQuery, sendMessage } from '../../helpers/context.helper.js';
import { shoppingListService } from '../../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';

export async function shareListAction(ctx) {
	try {
		const listUuid = getAdditionDataFromQuery(ctx);

		if (!listUuid) {
			await sendNoUserMessage(ctx);
		}

		const list = await shoppingListService.getShoppingListByUuid(listUuid);

		saveListId(ctx, list.uuid);

		await formatMessageForForward(ctx, listUuid);
	} catch (e) {
		console.log(e);
	}
}

async function formatMessageForForward(ctx, listUuid) {
	const message =
		'Что бы поделиться данным списком нужно переслать это сообщение другому пользователю.\n' +
		'Далее другой пользователь должен переслать это сообщение в свою версию бота "Авоська".\n' +
		'Бот автоматически добавить этот список к спискам пользователя.\n' +
		`<b>idList:"${listUuid}"</b>`;

	await sendMessage(ctx, message, { kbName: 'lists' });
}

function saveListId(ctx, uuid) {
	ctx.session[SESSION_FIELDS.CurrentListId] = uuid;
}

async function sendNoUserMessage(ctx) {
	await sendMessage(ctx, 'Не получен идентификатор списка в сообщении', {
		kbName: 'lists',
	});
}
