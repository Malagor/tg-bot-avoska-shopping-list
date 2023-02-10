import { KEYBOARD } from '../keyboards/keyboards.js';

export async function showKeyboardCommand(ctx) {
	ctx.reply('Клавиатура подключена', {
		reply_markup: KEYBOARD.main,
	});
}
