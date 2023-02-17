import { getRequire } from '../helpers/require-hook.js';
import { shoppingListService } from '../database/shopping-list.service.js';
import { KEYBOARD } from '../keyboards/keyboards.js';
import { SESSION_FIELDS } from '../constants/session-fields.constants.js';
import { parseProduct } from '../helpers/parsers.js';
import * as ctxHelper from '../helpers/context.helper.js';
import * as sceneHelper from '../helpers/scenes.helper.js';

const WizardScene = getRequire('telegraf/scenes/wizard');

export const editProductScene = new WizardScene(
	'editProductScene',
	async ctx => {
		try {
			saveSessionData(ctx);
			console.log(ctx.session[SESSION_FIELDS.ProductId]);

			await receiveNewProduct(ctx);
			return ctx.wizard.next();
		} catch (e) {
			console.log(e);
		}
	},
	async ctx => {
		try {
			const text = ctx.message.text;

			if (sceneHelper.isCancel(text)) {
				await sceneHelper.sendCancelMessage(ctx, 'main');

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
	await ctxHelper.sendMessage(ctx, html, { kbName: 'cancel' });
}

/**
 *
 * @param ctx
 * @param {Product} product
 * @return {Promise<void>}
 */
async function updateProduct(ctx, product) {
	try {
		const { session } = ctx;

		product.uuid = session[SESSION_FIELDS.ProductId];

		await updateProductInDB(ctx, product);
		await editTextProductInChat(ctx, product);
		await sceneHelper.sendNotificationMessages(
			ctx,
			`Продукт изменен.\n${session[SESSION_FIELDS.ProductInfo]} => ${product.toText()}`
		);
	} catch (e) {
		console.log(e);
	}
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
		product.toHtml(),
		{
			parse_mode: 'HTML',
			reply_markup: KEYBOARD.product({ product }),
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

	await shoppingListService.updateProduct(session[SESSION_FIELDS.CurrentListId], product);
}

function saveSessionData(ctx) {
	ctx.session[SESSION_FIELDS.MessageId] = ctxHelper.getMessageIdFromQuery(ctx);
	ctx.session[SESSION_FIELDS.QueryId] = ctxHelper.getQueryId(ctx);
	ctx.session[SESSION_FIELDS.ChatId] = ctxHelper.getChatId(ctx);
	ctx.session[SESSION_FIELDS.ProductId] = ctxHelper.getAdditionDataFromQuery(ctx);
	ctx.session[SESSION_FIELDS.ProductInfo] = ctxHelper.getText(ctx);
}
