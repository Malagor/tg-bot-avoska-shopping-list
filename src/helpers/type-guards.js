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
