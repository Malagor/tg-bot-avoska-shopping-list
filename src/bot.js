import Telegraf from 'telegraf';
import * as scenes from './scenes/index.js';
import { actionHandlerList } from './handlers/action-handler-list.js';
import { commandHandlerList } from './handlers/command-handler-list.js';
import { hearsHandlerList } from './handlers/hears-handler-list.js';
import { getRequire } from './helpers/require-hook.js';
import { updateHandlerList } from './handlers/update-handler-list.js';

const { Stage } = getRequire('telegraf');

const LocalSession = getRequire('telegraf-session-local');

export default class Bot {
	constructor(token) {
		this.bot = new Telegraf(token);

		this.init();
	}

	init() {
		this.bot.use(new LocalSession({ database: 'session.json' }).middleware());
		this.bot.use(this.addScenes().middleware());

		this.addListeners().catch(e => {
			console.log(e);
		});
	}

	launch() {
		this.bot
			.launch()
			.then(() => {
				console.log('The bot is connected and working...');
			})
			.catch(e => {
				console.log(e);
			});

		// Enable graceful stop
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
	}

	addScenes() {
		const stages = [];

		Object.keys(scenes).forEach(sc => {
			stages.push(scenes[sc]);
		});

		return new Stage(stages);
	}

	async addListeners() {
		await this.connectHears();
		await this.connectCommands();
		await this.connectActions();
		await this.connectUpdateHandlers();
	}

	async connectActions() {
		for (const action in actionHandlerList) {
			this.bot.action(this.createTrigger(action), actionHandlerList[action]);
		}
	}

	async connectCommands() {
		for (const command in commandHandlerList) {
			this.bot.command(command, commandHandlerList[command]);
		}
	}

	async connectHears() {
		for (const hears in hearsHandlerList) {
			this.bot.hears(hears, hearsHandlerList[hears]);
		}
	}

	async connectUpdateHandlers() {
		for (const updateType in updateHandlerList) {
			this.bot.on(updateType, updateHandlerList[updateType]);
		}
	}

	/**
	 *
	 * @param {string} action
	 * @return {RegExp}
	 */
	createTrigger(action) {
		return new RegExp(`^${action}-(.+)$`);
	}
}
