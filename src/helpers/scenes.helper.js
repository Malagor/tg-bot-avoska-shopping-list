import { mainKeyboard } from '../keyboards/keyboards.js';

/**
 *
 * @param ctx
 * @param {string} text
 * @return {Promise<void>}
 */
export async function sendNotificationMessages(ctx, text) {
	const { query_id } = ctx.session;

	if (query_id) {
		await ctx.telegram.answerCbQuery(query_id, text);
	}

	await ctx.replyWithHTML(text, {
		reply_markup: mainKeyboard,
	});
}

/**
 *
 * @param ctx
 * @return {Promise<void>}
 */
export async function sendCancelMessage(ctx) {
	await ctx.replyWithHTML('Операция отменена', {
		reply_markup: mainKeyboard,
	});
}

/**
 *
 * @param {string} text
 * @return {boolean}
 */
export function isCancel(text) {
	return text === 'Отменить' || text === '/cancel';
}
