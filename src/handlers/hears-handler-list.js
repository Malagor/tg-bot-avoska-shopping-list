import { KEYBOARD_BUTTON as kb } from '../constants/keyboard.constants.js';
import * as command from './commands/index.js';

export const hearsHandlerList = {
	[kb.add]: command.addProductCommand,
	[kb.list]: command.getListCommandHandler(),
	[kb.back]: command.backCommand,
	[kb.getAllLists]: command.allListCommand,
	[kb.showAllLists]: command.showAllListsCommand,
	[kb.showCurrentList]: command.currentListCommand,
	[kb.newList]: command.createListCommand,
	[kb.buyMode]: command.getListCommandHandler({ isBuyMode: true }),
};
