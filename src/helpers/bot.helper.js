import { getRequire } from './require-hook.js';
import * as scenes from '../scenes/index.js';

const { Stage } = getRequire('telegraf');

export function addScenes() {
	const stages = [];

	Object.keys(scenes).forEach(sc => {
		stages.push(scenes[sc]);
	});

	return new Stage(stages);
}
