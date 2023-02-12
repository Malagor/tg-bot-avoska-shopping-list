import { sendMessage } from '../../helpers/context.helper.js';
import { botCommands } from '../../constants/commands.constant.js';

export async function helpCommand(ctx) {
	await sendMessage(ctx, formatHelpText(botCommands), {
		kbName: 'main',
	});
}

/**
 *
 * @param {Array<BotCommand>} commands
 * @return {string}
 */
function formatHelpText(commands) {
	return commands.map(com => `/${com.command} - ${com.description}`).join('\n');
}
