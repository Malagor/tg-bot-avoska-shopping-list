import { getAdditionDataFromQuery, getQueryId } from '../helpers/context.helper.js';
import { productListService } from '../database/product-list.service.js';

/**
 *
 * @param ctx
 * @return {Promise<void>}
 */
export async function buyCommand(ctx) {
	try {
		const { shoppingList_id } = ctx.session;

		await productListService.deleteProduct(shoppingList_id, getAdditionDataFromQuery(ctx));

		await ctx.deleteMessage();

		await ctx.answerCbQuery(getQueryId(ctx), 'Продукт куплен', true);
	} catch (e) {
		console.log(e);
	}
}
