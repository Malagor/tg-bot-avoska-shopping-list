import { shoppingListService } from '../../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';
import * as helper from '../../helpers/context.helper.js';
import { COMMANDS } from '../../constants/commands.constant.js';

export async function startCommand(ctx) {
	const { session } = ctx;

	const list = await shoppingListService.getShoppingListByUuid(session[SESSION_FIELDS.CurrentListId]);
	if (!list) {
		await helper.sendMessage(
			ctx,
			'Список не найден. Попробуйте создать список или назначить текущим из списка /showLists',
			{ kbName: 'main' }
		);

		return;
	}

	ctx.session[SESSION_FIELDS.CurrentListId] = list.uuid;
	ctx.session[SESSION_FIELDS.UserId] = helper.getUserId(ctx);

	const text =
		'Привет. Это бот для составления списков продуктов. Списками можно делиться с другими людьми и вести их совместно или пользоваться самому.\n' +
		`Для начала можно перейти на страницу списков \/${COMMANDS.showLists} и там создать новый список.`;

	await helper.sendMessage(ctx, text, { kbName: 'main' });
}
