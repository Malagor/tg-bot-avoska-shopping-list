import { productListService } from '../database/product-list.service.js';
import { formatProductList } from '../formatters/format-product-list.js';
import { getUserId, getUserName } from '../helpers/context.helper.js';
import { mainKeyboard } from '../keyboards/keyboards.js';

export async function listCommand(ctx) {
	const userId = getUserId(ctx);
	let list;

	const listUuid = ctx.session.shoppingList_id;

	if (listUuid) {
		list = await productListService.getProductListByUuid(listUuid);
	} else {
		list = await productListService.getProductListByUserId(userId);
	}

	if (!list) {
		console.log('Не удалось найти список продуктов. Создаю новый!');
		const userName = getUserName(ctx);
		list = await productListService.createList(`Спискок пользователя ${userName}`, userId);
	}

	if (!list) {
		ctx.reply(`Не удалось получить или создать список для пользователя. Попробуйте позже`, {
			reply_markup: mainKeyboard,
		});
	}

	ctx.session.shoppingList_id = list.uuid;

	if (!list.products.length) {
		ctx.reply('Нет списка продуктов для отображения', {
			reply_markup: mainKeyboard,
		});

		return;
	}

	formatProductList(ctx, list.products);
}
