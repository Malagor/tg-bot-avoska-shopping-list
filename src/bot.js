import Telegraf from 'telegraf';
import * as scenes from './scenes/index.js';
import { actionHandlerList } from './handlers/action-handler-list.js';
import { commandHandlerList } from './handlers/command-handler-list.js';
import { hearsHandlerList } from './handlers/hears-handler-list.js';
import { getRequire } from './helpers/require-hook.js';
import { updateHandlerList } from './handlers/update-handler-list.js';
import { botCommands } from './constants/commands.constant.js';

const { Stage } = getRequire('telegraf');

const LocalSession = getRequire('telegraf-session-local');

export default class Bot {
	constructor(token) {
		this.bot = new Telegraf(token);

		this.init();
	}

	init() {
		try {
			this.bot.use(new LocalSession({ database: 'session.json' }).middleware());
			this.bot.use(this.addScenes().middleware());

			this.addListeners();

			this.bot.telegram.setMyCommands(botCommands).catch(e => {
				throw new Error(`Не удалось задать комманды бота\n${e}`);
			});
		} catch (e) {
			console.log(e);
		}
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

	addListeners() {
		this.connectHears();
		this.connectCommands();
		this.connectActions();
		this.connectUpdateHandlers();
	}

	connectActions() {
		for (const action in actionHandlerList) {
			this.bot.action(this.createTrigger(action), actionHandlerList[action]);
		}
	}

	connectCommands() {
		for (const command in commandHandlerList) {
			this.bot.command(command, commandHandlerList[command]);
		}
	}

	connectHears() {
		for (const hears in hearsHandlerList) {
			this.bot.hears(hears, hearsHandlerList[hears]);
		}
	}

	connectUpdateHandlers() {
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
