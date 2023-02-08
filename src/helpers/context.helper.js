/**
 *
 * @param ctx
 * @return {number}
 */
import { isQueryContext, isMessageContext } from './type-guards.js';

export function getUserId(ctx) {
	const id = ctx.update?.message?.from?.id;

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
