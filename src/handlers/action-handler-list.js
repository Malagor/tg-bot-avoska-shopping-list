import * as action from './actions/index.js';
import { ACTIONS } from '../constants/action.constants.js';

export const actionHandlerList = {
	[ACTIONS.edit]: action.editAction,
	[ACTIONS.delete]: action.deleteListAction,
	[ACTIONS.rename]: action.renameListAction,
	[ACTIONS.select]: action.selectCurrentListAction,
	[ACTIONS.share]: action.shareListAction,
};
