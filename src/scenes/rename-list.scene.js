import { isCancel, sendCancelMessage } from '../helpers/scenes.helper.js';
import { getRequire } from '../helpers/require-hook.js';
import * as helper from '../helpers/context.helper.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const renameListScene = new WizardScene(
	'renameListScene',
	async ctx => {
		try {
			ctx.session[SESSION_FIELDS.ShoppingListId] = helper.getAdditionDataFromQuery(ctx);

			await receiveNewName(ctx);
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

			await updateListName(ctx, text);

			await helper.sendMessage(ctx, 'Список переименован', { kbName: 'lists' });

			return ctx.scene.leave();
		} catch (e) {
			console.log(e);
		}
	}
);

async function receiveNewName(ctx) {
	await helper.sendMessage(ctx, 'Введите новое название списка', { kbName: 'cancel' });
}

/**
 *
 * @param ctx
 * @param {string} name
 * @return {Promise<void>}
 */
async function updateListName(ctx, name) {
	const { session } = ctx;
	await shoppingListService.updateListName(session[SESSION_FIELDS.ShoppingListId], name);
}
