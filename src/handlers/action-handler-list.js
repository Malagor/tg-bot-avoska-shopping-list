import * as action from './actions/index.js';
import { ACTIONS } from '../constants/action.constants.js';

export const actionHandlerList = {
	[ACTIONS.edit]: action.editAction,
	[ACTIONS.buy]: action.buyAction,
	[ACTIONS.delete]: action.deleteListAction,
	[ACTIONS.rename]: action.renameListAction,
	[ACTIONS.select]: action.selectCurrentListAction,
	[ACTIONS.share]: action.shareListAction,
	[ACTIONS.private]: action.madePrivateAction,
};
