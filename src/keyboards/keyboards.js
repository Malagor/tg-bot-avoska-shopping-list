import { getRequire } from '../helpers/require-hook.js';
import { KEYBOARD_BUTTON as kb } from '../constants/keyboard.constants.js';
import { ACTIONS } from '../constants/action.constants.js';
import { keyboardLayout } from '../helpers/keyboard.helper.js';

const { Markup } = getRequire('telegraf');

const mainKeyboard = Markup.keyboard([
	[kb.list, kb.buyMode],
	[kb.add, kb.getAllLists],
]).resize();

const cancelKeyboard = Markup.keyboard([kb.cancel]).resize();

const listsKeyboard = Markup.keyboard([
	[kb.showAllLists, kb.showCurrentList],
	[kb.newList, kb.back],
]).resize();

const warningKeyboard = Markup.keyboard([[kb.yes, kb.cancel]]).resize();

/**
 *
 * @param {KeyboardOptions} productUuid
 * @return {Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup}
 */
export function getProductKeyboard({ product }) {
	return Markup.inlineKeyboard([
		[
			Markup.callbackButton(kb.edit, `${ACTIONS.edit}-${product.uuid}`),
			Markup.callbackButton(kb.buy, `${ACTIONS.buy}-${product.uuid}`),
		],
	]);
}

/**
 *
 * @param {KeyboardOptions} options
 * @return {Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup}
 */
function getCurrentKeyboard({ list, userId }) {
	if (!list) {
		return Markup.inlineKeyboard([]);
	}

	const { uuid } = list;

	const buttons = [];

	if (list.isOwner(userId)) {
		buttons.push(Markup.callbackButton(kb.renameList, `${ACTIONS.rename}-${uuid}`));
		buttons.push(getShareToggleButton(list));
	}

	buttons.push(Markup.callbackButton(kb.deleteList, `${ACTIONS.delete}-${uuid}`));

	return Markup.inlineKeyboard(keyboardLayout(buttons));
}

/**
 *
 * @param {KeyboardOptions} options
 * @return {Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup}
 */
function getShoppingListKeyboard({ list, userId, currentListId }) {
	if (!list) {
		return Markup.inlineKeyboard([]);
	}

	const buttons = [];

	if (!list.isCurrent(currentListId)) {
		buttons.push(Markup.callbackButton(kb.selectCurrent, `${ACTIONS.select}-${list.uuid}`));
	}

	if (list.isOwner(userId)) {
		buttons.push(Markup.callbackButton(kb.renameList, `${ACTIONS.rename}-${list.uuid}`));
		buttons.push(getShareToggleButton(list));
	}
	buttons.push(Markup.callbackButton(kb.deleteList, `${ACTIONS.delete}-${list.uuid}`));

	return Markup.inlineKeyboard(keyboardLayout(buttons));
}

/**
 *
 * @param {ShoppingList} list
 */
function getShareToggleButton(list) {
	const { uuid } = list;

	return list.isPrivate()
		? Markup.callbackButton(kb.shareList, `${ACTIONS.share}-${uuid}`)
		: Markup.callbackButton(kb.private, `${ACTIONS.private}-${uuid}`);
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
