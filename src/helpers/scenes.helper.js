import { KEYBOARD_BUTTON as kb } from '../constants/keyboard.constants.js';
import { sendMessage } from './context.helper.js';

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

	await sendMessage(ctx, text, { kbName: 'main' });
}

/**
 *
 * @param ctx
 * @param {string} kbName
 * @return {Promise<void>}
 */
export async function sendCancelMessage(ctx, kbName = '') {
	await sendMessage(ctx, 'Операция отменена', { kbName });
}

/**
 *
 * @param {string} text
 * @return {boolean}
 */
export function isCancel(text) {
	return text === kb.cancel || text === '/cancel';
}
