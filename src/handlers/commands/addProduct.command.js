import { SESSION_FIELDS } from '../../constants/session-fields.constants.js';
import { sendMessage } from '../../helpers/context.helper.js';
import { COMMANDS } from '../../constants/commands.constant.js';

export async function addProductCommand(ctx) {
	try {
		const { session } = ctx;

		if (!session[SESSION_FIELDS.CurrentListId]) {
			await sendMessage(ctx, `Не выбран или не создан список. Воспользуйтесь командой /${COMMANDS.showLists}`, {
				kbName: 'lists',
			});
		}

		await ctx.scene.enter('addProductScene');
	} catch (e) {
		console.error('ERROR! Can not enter addProductScene\n', e);
	}
}
