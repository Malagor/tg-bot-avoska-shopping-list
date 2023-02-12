import * as command from './commands/index.js';

import { UPDATE_TYPE } from '../constants/update-types.constant.js';

export const updateHandlerList = {
	[UPDATE_TYPE.inline]: command.inlineQueryListCommand,
	[UPDATE_TYPE.forward]: command.forwardMessageCommand,
};
