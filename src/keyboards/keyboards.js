import { getRequire } from '../helpers/requireHook.js';

const { Markup } = getRequire('telegraf');

export const mainKeyboard = Markup.keyboard([['Показать список', 'Добавить продукты']]).resize();

export function getProductKeyboard(product) {
	return Markup.inlineKeyboard([
		[
			Markup.callbackButton('Редактировать', `edit-${product.uuid}`),

			Markup.callbackButton('Купить', `buy-${product.uuid}`),
		],
	]);
}

export const cancelKeyboard = Markup.keyboard(['Отменить']).resize();
