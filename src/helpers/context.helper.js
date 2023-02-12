/**
 *
 * @param ctx
 * @return {number}
 */
import { isInlineQuery, isMessageContext, isQueryContext } from './type-guards.js';
import { KEYBOARD } from '../keyboards/keyboards.js';

export function getUserId(ctx) {
	let id;

	if (isMessageContext(ctx)) {
		id = ctx.update?.message?.from?.id;
	} else if (isInlineQuery(ctx)) {
		id = ctx.update.inline_query.from.id;
	}

	if (!id) {
		throw new Error('Не получилось извлечь ID пользователя из контекста');
	}

	return id;
}

export function getUserIdFromQuery(ctx) {
	const id = ctx.update?.callback_query?.from?.id;
	if (!id) {
		throw new Error('Не получилось извлечь ID пользователя из контекста');
	}

	return id;
}

/**
 *
 * @param ctx
 * @return {string}
 */
export function getUserName(ctx) {
	if (isQueryContext(ctx)) {
		return ctx.update?.callback_query.message?.from?.username;
	}

	if (isMessageContext(ctx)) {
		return ctx.update?.message?.from?.username;
	}
}

export function getChatId(ctx) {
	if (isQueryContext(ctx)) {
		return ctx.update?.callback_query.message?.chat.id;
	}

	if (isMessageContext(ctx)) {
		return ctx.update?.message.chat.id;
	}
}

/**
 *
 * @param ctx
 * @return {string | undefined}
 */
export function getQueryId(ctx) {
	return ctx.update?.callback_query?.id;
}

/**
 *
 * @param ctx
 * @return {string | undefined}
 */
export function getAdditionDataFromQuery(ctx) {
	return ctx.match[1];
}

/**
 *
 * @param ctx
 * @return {number | undefined}
 */
export function getMessageIdFromQuery(ctx) {
	return ctx?.update?.callback_query?.message.message_id;
}

export function getText(ctx) {
	if (isQueryContext(ctx)) {
		return ctx.update?.callback_query.message?.text;
	}

	if (isMessageContext(ctx)) {
		return ctx.update?.message?.text;
	}
}

/**
 *
 * @param ctx
 * @param {string} html
 * @param {{kbName: string, kbArgs: string}} options - keyboard options
 * @return {Promise<void>}
 */
export async function sendMessage(ctx, html, { kbName, kbArgs = '' } = {}) {
	let keyboard = KEYBOARD[kbName];

	if (!keyboard) {
		console.error('Не найдена клавиатура для сообщения');
	} else {
		if (typeof keyboard === 'function') {
			keyboard = KEYBOARD[kbName](kbArgs);
		} else {
			keyboard = KEYBOARD[kbName];
		}
	}

	if (keyboard) {
		await ctx.replyWithHTML(html, {
			reply_markup: keyboard,
			disable_notification: true,
		});
	} else {
		await ctx.replyWithHTML(html, {
			disable_notification: true,
		});
	}
}
