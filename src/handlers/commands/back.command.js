import { KEYBOARD } from '../../keyboards/keyboards.js';

export async function backCommand(ctx) {
	ctx.reply('Выберите комманду для работы', {
		reply_markup: KEYBOARD.main,
	});
}
