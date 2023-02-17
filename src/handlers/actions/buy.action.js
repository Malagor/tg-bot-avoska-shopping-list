import { getAdditionDataFromQuery, getText } from '../../helpers/context.helper.js';
import { shoppingListService } from '../../database/shopping-list.service.js';
import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';

/**
 *
 * @param ctx
 * @return {Promise<void>}
 */
export async function buyAction(ctx) {
	try {
		const { session } = ctx;
		const product = getText(ctx);

		await shoppingListService.deleteProduct(session[SESSION_FIELDS.CurrentListId], getAdditionDataFromQuery(ctx));

		await ctx.deleteMessage();

		await ctx.reply(`Куплен продукт => ${product}`);
	} catch (e) {
		console.log(e);
	}
}
