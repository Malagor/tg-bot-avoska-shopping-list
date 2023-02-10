import { getRequire } from '../helpers/require-hook.js';
import * as helper from '../helpers/context.helper.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';
import * as sceneHelper from '../helpers/scenes.helper.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const createListScene = new WizardScene(
	'createListScene',
	async ctx => {
		try {
			await receiveListName(ctx);
			return ctx.wizard.next();
		} catch (e) {
			console.log(e);
		}
	},
	async ctx => {
		try {
			const text = helper.getText(ctx);

			if (sceneHelper.isCancel(text)) {
				await sceneHelper.sendCancelMessage(ctx, 'lists');

				return ctx.scene.leave();
			}

			await createList(ctx, text).then(list => {
				if (list) {
					helper.sendMessage(ctx, 'Список создан с установлен текущим', { kbName: 'lists' });
				}
			});

			return ctx.scene.leave();
		} catch (e) {
			console.log(e);
		}
	}
);

async function receiveListName(ctx) {
	await helper.sendMessage(ctx, 'Введите название списка или команду /cancel', { kbName: 'cancel' });
}

/**
 *
 * @param ctx
 * @param {string} name
 * @return {Promise<void>}
 */
async function createList(ctx, name) {
	const { session } = ctx;
	const list = await shoppingListService.createList(name, helper.getUserId(ctx));

	if (!list) {
		await helper.sendMessage(ctx, 'Не получилось создать новый список. Попробуйте через некоторое время', {
			kbName: 'lists',
		});
		return;
	}

	session[SESSION_FIELDS.ShoppingListId] = list.uuid;
	const html = `Новый список с именем ${list.name} создан и установлен как текущий.`;

	await helper.sendMessage(ctx, html, { kbName: 'lists' });
}
