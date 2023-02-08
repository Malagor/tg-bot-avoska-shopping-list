import { mainKeyboard } from '../keyboards/keyboards.js';

export async function showKeyboardCommand(ctx) {
	ctx.reply('Клавиатура подключена', {
		reply_markup: mainKeyboard,
	});
}
