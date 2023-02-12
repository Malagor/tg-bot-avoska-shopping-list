import { KEYBOARD } from '../../keyboards/keyboards.js';

export function helpCommand(ctx) {
	ctx.reply(
		'/start - начало работы\n' +
			'/help - помощь\n' +
			'/keyboard - показать главные кнопки\n' +
			'/list - показать текущий список покупок\n' +
			'/add - добавить продукт в список\n' +
			'/cancel - отменить текущую операцию',
		{
			reply_markup: KEYBOARD.main,
		}
	);
}
