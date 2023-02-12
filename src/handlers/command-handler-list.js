import { COMMANDS } from '../constants/commands.constant.js';
import * as command from './commands/index.js';

export const commandHandlerList = {
	[COMMANDS.start]: command.startCommand,
	[COMMANDS.help]: command.helpCommand,
	[COMMANDS.add]: command.addProductCommand,
	[COMMANDS.list]: command.getListCommandHandler(),
	[COMMANDS.showLists]: command.showAllListsCommand,
	[COMMANDS.keyboard]: command.showKeyboardCommand,
};
