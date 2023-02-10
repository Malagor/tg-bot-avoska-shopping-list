import Telegraf from 'telegraf';
import { getConfig } from './config/config.service.js';
import { getRequire } from './helpers/require-hook.js';
import * as commands from './commands/index.js';
import { KEYBOARD_BUTTON as kb } from './constants/keyboard.constants.js';
import { addScenes } from './helpers/bot.helper.js';

const LocalSession = getRequire('telegraf-session-local');

export async function runBot() {
	const bot = new Telegraf(getConfig('BOT_TOKEN'));
	const stage = addScenes();

	bot.use(new LocalSession({ database: 'session.json' }).middleware());
	bot.use(stage.middleware());

	bot.start(commands.startCommand);
	bot.help(commands.helpCommand);

	bot.hears(kb.Add, commands.addProductCommand);
	bot.hears(kb.List, commands.listCommand);
	bot.hears(kb.BuyMode, async ctx => {
		await commands.listCommand(ctx, { isBuyMode: true });
	});

	// LISTS
	bot.hears(kb.Back, commands.backCommand);
	bot.hears(kb.GetAllLists, commands.allListCommand);
	bot.hears(kb.ShowAllLists, commands.showAllListsCommand);
	bot.hears(kb.ShowCurrentList, commands.currentListCommand);
	bot.hears(kb.Create, commands.createListCommand);

	// COMMANDS
	bot.command('list', commands.listCommand);
	bot.command('keyboard', commands.showKeyboardCommand);
	bot.command('add', commands.addProductCommand);
	bot.command('showLists', commands.allListCommand);

	// ACTIONS
	bot.action(/^edit-(.+)$/, commands.editCommand);
	bot.action(/^buy-(.+)$/, commands.buyCommand);
	bot.action(/^select-(.+)$/, commands.selectCurrentList);
	bot.action(/^rename-(.+)$/, commands.renameListCommand);
	bot.action(/^delete-(.+)$/, commands.deleteListCommand);

	bot.launch()
		.then(() => {
			console.log('The bot is connected and working...');
		})
		.catch(e => {
			console.log(e);
		});

	// Enable graceful stop
	process.once('SIGINT', () => bot.stop('SIGINT'));
	process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
