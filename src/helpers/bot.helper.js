import * as scenes from '../scenes/index.js';
import { actionHandlerList } from '../handlers/action-handler-list.js';
import { commandHandlerList } from '../handlers/command-handler-list.js';
import { hearsHandlerList } from '../handlers/hears-handler-list.js';

import { getRequire } from './require-hook.js';
const { Stage } = getRequire('telegraf');

export function addScenes() {
	const stages = [];

	Object.keys(scenes).forEach(sc => {
		stages.push(scenes[sc]);
	});

	return new Stage(stages);
}

/**
 *
 * @param {string} action
 * @return {RegExp}
 */
function createTrigger(action) {
	return new RegExp(`^${action}-(.+)$`);
}

export async function connectActions(bot) {
	for (const action in actionHandlerList) {
		bot.action(createTrigger(action), actionHandlerList[action]);
	}
}

export async function connectCommands(bot) {
	for (const command in commandHandlerList) {
		bot.command(command, commandHandlerList[command]);
	}
}

export async function connectHears(bot) {
	for (const hears in hearsHandlerList) {
		bot.hears(hears, hearsHandlerList[hears]);
	}
}
