/**
 *
 * @param ctx
 * @return {boolean}
 */
export function isQueryContext(ctx) {
	return !!ctx?.update?.callback_query;
}

export function isMessageContext(ctx) {
	return !!ctx?.update?.message;
}

export function isInlineQuery(ctx) {
	return !!ctx?.update?.inline_query.id;
}
