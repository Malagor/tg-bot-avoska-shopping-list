import { productListService } from '../database/product-list.service.js';

export async function createListCommand(ctx) {
	const userId = ctx.update.message.from.id;

	return productListService.createList('Список нового пользователя второй', userId);
}
