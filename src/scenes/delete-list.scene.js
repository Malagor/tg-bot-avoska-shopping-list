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

			const list = await shoppingListService.getShoppingListByUuid(uuid);

			saveUuid(ctx, uuid);
			saveListName(ctx, list.name);

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

			await deleteList(ctx);

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
 * @return {Promise<void>}
 */
async function deleteList(ctx) {
	const { session } = ctx;
	await shoppingListService.deleteList(session[SESSION_FIELDS.ShoppingListId]);
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

	session[SESSION_FIELDS.ShoppingListName] = '';
	session[SESSION_FIELDS.ShoppingListId] = '';
}
