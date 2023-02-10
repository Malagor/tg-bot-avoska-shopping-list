import { getRequire } from '../helpers/require-hook.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { KEYBOARD } from '../keyboards/keyboards.js';
import { parseProduct } from '../helpers/parsers.js';
import * as contextHelpers from '../helpers/context.helper.js';
import { formatProductHTML, formatProductText } from '../formatters/format-product-list.js';
import * as sceneHelpers from '../helpers/scenes.helper.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const editProductScene = new WizardScene(
	'editProductScene',
	async ctx => {
		try {
			ctx.session[SESSION_FIELDS.MessageId] = contextHelpers.getMessageIdFromQuery(ctx);
			ctx.session[SESSION_FIELDS.QueryId] = contextHelpers.getQueryId(ctx);
			ctx.session[SESSION_FIELDS.ChatId] = contextHelpers.getChatId(ctx);
			ctx.session[SESSION_FIELDS.ProductId] = contextHelpers.getAdditionDataFromQuery(ctx);

			ctx.session[SESSION_FIELDS.ProductInfo] = contextHelpers.getText(ctx);

			await receiveNewProduct(ctx);
			return ctx.wizard.next();
		} catch (e) {
			console.log(e);
		}
	},
	async ctx => {
		try {
			const text = ctx.message.text;

			if (sceneHelpers.isCancel(text)) {
				await sceneHelpers.sendCancelMessage(ctx, 'main');

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
	const html = 'Введите измененные данные в формате <b>"Продукт Количество"</b>.';
	await contextHelpers.sendMessage(ctx, html, { kbName: 'cancel' });
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
		await sceneHelpers.sendNotificationMessages(
			ctx,
			`Продукт изменен.\n${session[SESSION_FIELDS.ProductInfo]} => ${formatProductText(product)}`
		);
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
	const { session } = ctx;

	await ctx.telegram.editMessageText(
		session[SESSION_FIELDS.ChatId],
		session[SESSION_FIELDS.MessageId],
		session[SESSION_FIELDS.MessageId],
		formatProductHTML(product),
		{
			parse_mode: 'HTML',
			reply_markup: KEYBOARD.product(product.uuid),
		}
	);
}

/**
 *
 * @param ctx
 * @param {Product} product
 * @return {Promise<void>}
 */
async function updateProductInDB(ctx, product) {
	const { session } = ctx;

	await shoppingListService.updateProduct(session[SESSION_FIELDS.ShoppingListId], product);
}
