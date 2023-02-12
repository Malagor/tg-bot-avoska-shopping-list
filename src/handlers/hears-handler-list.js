import { KEYBOARD_BUTTON as kb } from '../constants/keyboard.constants.js';
import * as command from './commands/index.js';

export const hearsHandlerList = {
	[kb.Add]: command.addProductCommand,
	[kb.List]: command.getListCommandHandler(),
	[kb.Back]: command.backCommand,
	[kb.GetAllLists]: command.allListCommand,
	[kb.ShowAllLists]: command.showAllListsCommand,
	[kb.ShowCurrentList]: command.currentListCommand,
	[kb.NewList]: command.createListCommand,
	[kb.BuyMode]: command.getListCommandHandler({ isBuyMode: true }),
};
