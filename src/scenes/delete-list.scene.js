import { isCancel, sendCancelMessage } from '../helpers/scenes.helper.js';
import { getRequire } from '../helpers/require-hook.js';
import * as helper from '../helpers/context.helper.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const deleteListScene = new WizardScene(
	'deleteListScene',
	async ctx => {
		try {
			const uuid = helper.getAdditionDataFromQuery(ctx);
			saveUuid(ctx, uuid);

			await sendConfirmationMessage(ctx);
			return ctx.wizard.next();
		} catch (e) {
			console.log(e);
		}
	},
	async ctx => {
		try {
			const text = helper.getText(ctx);

			if (isCancel(text)) {
				await sendCancelMessage(ctx, 'lists');

				return ctx.scene.leave();
			}

			const list = await shoppingListService.getShoppingListByUuid(ctx.session[SESSION_FIELDS.ShoppingListId]);

			saveListName(ctx, list.name);

			await deleteList(ctx, list);

			resetListSettings(ctx);

			await sendResultMessage(ctx);

			return ctx.scene.leave();
		} catch (e) {
			console.log(e);
		}
	}
);

async function sendConfirmationMessage(ctx) {
	const { session } = ctx;
	const listName = session[SESSION_FIELDS.ShoppingListName];
	const html = `Вы подтверждаете удаление списка <b>${listName}</b>? Восстановить удаленный список нельзя.`;

	await helper.sendMessage(ctx, html, { kbName: 'warning' });
}

/**
 *
 * @param ctx
 * @param {ShoppingList} list
 * @return {Promise<void>}
 */
async function deleteList(ctx, list) {
	const { session } = ctx;

	const userId = session[SESSION_FIELDS.UserId];

	if (list.isOwner(userId)) {
		await shoppingListService.deleteList(list.uuid);
	} else {
		const newUserList = list.userIds.filter(u => u !== userId);

		await shoppingListService.updateUsers(list.uuid, newUserList);
	}
}

function saveUuid(ctx, uuid) {
	ctx.session[SESSION_FIELDS.ShoppingListId] = uuid;
}

function saveListName(ctx, name) {
	ctx.session[SESSION_FIELDS.ShoppingListName] = name;
}

async function sendResultMessage(ctx) {
	const { session } = ctx;
	const listName = session[SESSION_FIELDS.ShoppingListName];
	const html = `Список <b>${listName}</b> удален. Если это был текущий список, следует назначить новый список текущим`;

	await helper.sendMessage(ctx, html, { kbName: 'lists' });
}

function resetListSettings(ctx) {
	const { session } = ctx;
	if (session[SESSION_FIELDS.ShoppingListId] === session[SESSION_FIELDS.CurrentListId]) {
		session[SESSION_FIELDS.CurrentListId] = '';
	}

	session[SESSION_FIELDS.ShoppingListId] = '';
	session[SESSION_FIELDS.ShoppingListName] = '';
}
