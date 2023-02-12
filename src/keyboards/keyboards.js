import { getRequire } from '../helpers/require-hook.js';
import { KEYBOARD_BUTTON as kb } from '../constants/keyboard.constants.js';

const { Markup } = getRequire('telegraf');

const mainKeyboard = Markup.keyboard([
	[kb.List, kb.BuyMode],
	[kb.Add, kb.GetAllLists],
]).resize();

const cancelKeyboard = Markup.keyboard([kb.Cancel]).resize();

const listsKeyboard = Markup.keyboard([
	[kb.ShowAllLists, kb.ShowCurrentList],
	[kb.NewList, kb.Back],
]).resize();

const warningKeyboard = Markup.keyboard([[kb.Yes, kb.Cancel]]).resize();

/**
 *
 * @param {string} productUuid
 * @return {Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup}
 */
export function getProductKeyboard(productUuid) {
	return Markup.inlineKeyboard([
		[Markup.callbackButton(kb.Edit, `edit-${productUuid}`), Markup.callbackButton(kb.Buy, `buy-${productUuid}`)],
	]);
}

/**
 *
 * @param {string} listUuid - id current list
 * @return {Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup}
 */
function getCurrentKeyboard(listUuid) {
	return Markup.inlineKeyboard([
		Markup.callbackButton(kb.RenameList, `rename-${listUuid}`),
		Markup.callbackButton(kb.ShareList, `share-${listUuid}`),
		Markup.callbackButton(`${kb.DeleteList}`, `delete-${listUuid}`),
	]);
}

/**
 *
 * @param {string} listUuid
 * @return {Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup}
 */
function getShoppingListKeyboard(listUuid) {
	return Markup.inlineKeyboard([
		[
			Markup.callbackButton(kb.SelectCurrent, `select-${listUuid}`),
			Markup.callbackButton(kb.RenameList, `rename-${listUuid}`),
		],
		[
			Markup.callbackButton(kb.ShareList, `share-${listUuid}`),
			Markup.callbackButton(`${kb.DeleteList}`, `delete-${listUuid}`),
		],
	]);
}

export const KEYBOARD = {
	main: mainKeyboard,
	cancel: cancelKeyboard,
	lists: listsKeyboard,
	warning: warningKeyboard,
	current: getCurrentKeyboard,
	product: getProductKeyboard,
	shoppingList: getShoppingListKeyboard,
};
