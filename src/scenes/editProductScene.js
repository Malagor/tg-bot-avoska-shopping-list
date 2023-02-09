import { getRequire } from '../helpers/requireHook.js';
import { productListService } from '../database/product-list.service.js';
import { cancelKeyboard, getProductKeyboard } from '../keyboards/keyboards.js';
import { parseProduct } from '../helpers/parsers.js';
import { getQueryId, getMessageIdFromQuery, getAdditionDataFromQuery, getChatId } from '../helpers/context.helper.js';
import { formatProductHTML, formatProductText } from '../formatters/format-product-list.js';
import { isCancel, sendNotificationMessages, sendCancelMessage } from '../helpers/scenes.helper.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const editProductScene = new WizardScene(
	'editProductScene',
	async ctx => {
		try {
			ctx.session[SESSION_FIELDS.MessageId] = getMessageIdFromQuery(ctx);
			ctx.session[SESSION_FIELDS.QueryId] = getQueryId(ctx);
			ctx.session[SESSION_FIELDS.ChatId] = getChatId(ctx);
			ctx.session[SESSION_FIELDS.ProductId] = getAdditionDataFromQuery(ctx);

			ctx.session[SESSION_FIELDS.ProductInfo] = ctx.update.callback_query.message.text;

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
		const { session } = ctx;

		restorePreviousProductId(product, session[SESSION_FIELDS.ProductId]);

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
