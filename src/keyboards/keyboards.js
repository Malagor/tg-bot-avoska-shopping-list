import { getRequire } from '../helpers/requireHook.js';
import { KEYBOARD as kb } from '../constants/keyboard.constants.js';

const { Markup } = getRequire('telegraf');

export const mainKeyboard = Markup.keyboard([[kb.List, kb.Add], [kb.BuyMode]]).resize();

export function getProductKeyboard(product) {
	return Markup.inlineKeyboard([
		[Markup.callbackButton(kb.Edit, `edit-${product.uuid}`), Markup.callbackButton(kb.Buy, `buy-${product.uuid}`)],
	]);
}

export const cancelKeyboard = Markup.keyboard([kb.Cancel]).resize();
