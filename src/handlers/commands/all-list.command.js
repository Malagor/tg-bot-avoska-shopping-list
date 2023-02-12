import { KEYBOARD } from '../../keyboards/keyboards.js';
import { getRequire } from '../../helpers/require-hook.js';

const { Extra } = getRequire('telegraf');

export async function allListCommand(ctx) {
	ctx.reply('Страница работы со списками', Extra.markup(KEYBOARD.lists));
}
