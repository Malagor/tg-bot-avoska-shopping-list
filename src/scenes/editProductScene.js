import { getRequire } from '../helpers/requireHook.js';
import { productListService } from '../database/product-list.service.js';
import { cancelKeyboard, getProductKeyboard } from '../keyboards/keyboards.js';
import { parseProduct } from '../helpers/parsers.js';
import { getQueryId, getMessageIdFromQuery, getAdditionDataFromQuery, getChatId } from '../helpers/context.helper.js';
import { formatProductHTML, formatProductText } from '../formatters/format-product-list.js';
import { isCancel, sendNotificationMessages, sendCancelMessage } from '../helpers/scenes.helper.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const editProductScene = new WizardScene(
	'editProductScene',
	async ctx => {
		try {
			ctx.session.message_id = getMessageIdFromQuery(ctx);
			ctx.session.query_id = getQueryId(ctx);
			ctx.session.chat_id = getChatId(ctx);
			ctx.session.product_id = getAdditionDataFromQuery(ctx);

			ctx.session.text = ctx.update.callback_query.message.text;

			await receiveNewProduct(ctx);
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

			await updateProduct(ctx, parseProduct(text));

			return ctx.scene.leave();
		} catch (e) {
			console.log(e);
		}
	}
);

async function receiveNewProduct(ctx) {
	await ctx.replyWithHTML('Введите измененные данные в формате <b>"Продукт Количество"</b>.', {
		reply_markup: cancelKeyboard,
	});
}

/**
 *
 * @param ctx
 * @param product
 * @return {Promise<void>}
 */
async function updateProduct(ctx, product) {
	try {
		const { product_id, text } = ctx.session;

		restorePreviousProductId(product, product_id);

		await updateProductInDB(ctx, product);
		await editTextProductInChat(ctx, product);
		await sendNotificationMessages(ctx, `Продукт изменен.\n${text} => ${formatProductText(product)}`);
	} catch (e) {
		console.log(e);
	}
}

/**
 *
 * @param {Product} product
 * @param {string} oldId
 */
function restorePreviousProductId(product, oldId) {
	product.uuid = oldId;
}

/**
 *
 * @param ctx
 * @param {Product} product
 * @return {Promise<void>}
 */
async function editTextProductInChat(ctx, product) {
	const { message_id, chat_id } = ctx.session;

	await ctx.telegram.editMessageText(chat_id, message_id, message_id, formatProductHTML(product), {
		parse_mode: 'HTML',
		reply_markup: getProductKeyboard(product),
	});
}

/**
 *
 * @param ctx
 * @param {Product} product
 * @return {Promise<void>}
 */
async function updateProductInDB(ctx, product) {
	const { shoppingList_id } = ctx.session;

	await productListService.updateProduct(shoppingList_id, product);
}
