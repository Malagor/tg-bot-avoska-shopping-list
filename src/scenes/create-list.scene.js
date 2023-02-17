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
	const userId = helper.getUserId(ctx);

	saveUserId(ctx, userId);

	const list = await shoppingListService.createList(name, userId);

	if (!list) {
		await helper.sendMessage(ctx, 'Не получилось создать новый список. Попробуйте через некоторое время', {
			kbName: 'lists',
		});
		return;
	}

	saveCurrentListId(ctx, list.uuid);

	const html = `Новый список с именем ${list.name} создан и установлен как текущий.`;

	await helper.sendMessage(ctx, html, { kbName: 'lists' });
}

/**
 *
 * @param ctx
 * @param {string} uuid
 */
function saveCurrentListId(ctx, uuid) {
	const { session } = ctx;

	session[SESSION_FIELDS.CurrentListId] = uuid;
}

/**
 *
 * @param ctx
 * @param {number} userId
 */
function saveUserId(ctx, userId) {
	ctx.session[SESSION_FIELDS.UserId] = userId;
}
