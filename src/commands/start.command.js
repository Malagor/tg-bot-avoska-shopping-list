import { mainKeyboard } from '../keyboards/keyboards.js';
import { productListService } from '../database/product-list.service.js';
import { getUserId } from '../helpers/context.helper.js';

export function startCommand(ctx) {
	productListService.getProductListByUserId(getUserId(ctx)).then(list => {
		if (!list) {
			console.log('Списко не найден');
			return;
		}

		ctx.session.shoppingList_id = list.uuid;
	});

	ctx.reply(`Welcome`, {
		reply_markup: mainKeyboard,
	});
}
