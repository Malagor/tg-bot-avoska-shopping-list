import { getRequire } from '../helpers/requireHook.js';
import { productListService } from '../database/product-list.service.js';
import { cancelKeyboard } from '../keyboards/keyboards.js';
import { parseProductList } from '../helpers/parsers.js';
import { isCancel, sendNotificationMessages, sendCancelMessage } from '../helpers/scenes.helper.js';
import { getQueryId, getChatId } from '../helpers/context.helper.js';
import { isQueryContext } from '../helpers/type-guards.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const addProductScene = new WizardScene(
	'addProductScene',
	async ctx => {
		try {
			ctx.session.query_id = isQueryContext(ctx) ? getQueryId(ctx) : undefined;

			ctx.session.chat_id = getChatId(ctx);

			await receiveProducts(ctx);

			return ctx.wizard.next();
		} catch (e) {
			console.log(e);
		}
	},
	async ctx => {
		try {
			const text = ctx.message.text;

			if (isCancel(text)) {
				await sendCancelMessage(ctx);

				return ctx.scene.leave();
			}

			await addProducts(ctx, parseProductList(text));

			await sendNotificationMessages(ctx, 'Продукты добавлены');

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
			reply_markup: cancelKeyboard,
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
	const { shoppingList_id } = ctx.session;

	await productListService.addProducts(shoppingList_id, products);
}
