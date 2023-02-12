import { getRequire } from '../helpers/require-hook.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { KEYBOARD } from '../keyboards/keyboards.js';
import { parseProductList } from '../helpers/parsers.js';
import * as helper from '../helpers/scenes.helper.js';
import { getQueryId, getChatId } from '../helpers/context.helper.js';
import { isQueryContext } from '../helpers/type-guards.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const addProductScene = new WizardScene(
	'addProductScene',
	async ctx => {
		try {
			saveQueryId(ctx);
			saveChatId(ctx);
			await receiveProducts(ctx);

			return ctx.wizard.next();
		} catch (e) {
			console.log(e);
		}
	},
	async ctx => {
		try {
			const text = ctx.message.text;

			if (helper.isCancel(text)) {
				await helper.sendCancelMessage(ctx, 'main');

				return ctx.scene.leave();
			}

			await addProducts(ctx, parseProductList(text));

			await helper.sendNotificationMessages(ctx, 'Продукты добавлены');

			return ctx.scene.leave();
		} catch (e) {
			console.log(e);
		}
	}
);

async function receiveProducts(ctx) {
	await ctx.replyWithHTML(
		`Введите продукты в формате <b>"Продукт Количество"</b>. Можно ввести несколько продуктов - <b>каждый с новой строки</b>`,
		{
			reply_markup: KEYBOARD.cancel,
		}
	);
}

/**
 *
 * @param ctx
 * @param {Array<Product>}products
 * @return {Promise<void>}
 */
async function addProducts(ctx, products) {
	const { session } = ctx;

	await shoppingListService.addProducts(session[SESSION_FIELDS.CurrentListId], products);
}

function saveQueryId(ctx) {
	ctx.session[SESSION_FIELDS.QueryId] = isQueryContext(ctx) ? getQueryId(ctx) : undefined;
}

function saveChatId(ctx) {
	ctx.session[SESSION_FIELDS.ChatId] = getChatId(ctx);
}
