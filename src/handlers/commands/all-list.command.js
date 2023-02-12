import { sendMessage } from '../../helpers/context.helper.js';

export async function allListCommand(ctx) {
	await sendMessage(ctx, 'Страница работы со списками', { kbName: 'lists' });
}
