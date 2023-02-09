import Telegraf from 'telegraf';
import { getConfig } from './config/config.service.js';
import { listCommand } from './commands/list.command.js';
import { buyCommand } from './commands/buy.command.js';
import { showKeyboardCommand } from './commands/showKeyboard.command.js';
import { addProductScene } from './scenes/addProductScene.js';
import { getRequire } from './helpers/requireHook.js';
import { helpCommand } from './commands/help.command.js';
import { startCommand } from './commands/start.command.js';
import { editCommand } from './commands/edit.command.js';
import { addProductCommand } from './commands/addProduct.command.js';
import { editProductScene } from './scenes/editProductScene.js';
import { KEYBOARD as kb } from './constants/keyboard.constants.js';

const { Stage } = getRequire('telegraf');
const LocalSession = getRequire('telegraf-session-local');

export async function runBot() {
	const bot = new Telegraf(getConfig('BOT_TOKEN'));
	const stage = new Stage([addProductScene, editProductScene]);

	bot.use(new LocalSession({ database: 'session.json' }).middleware());
	bot.use(stage.middleware());

	bot.start(startCommand);
	bot.help(helpCommand);

	bot.hears(kb.Add, addProductCommand);
	bot.hears(kb.List, listCommand);
	bot.hears(kb.BuyMode, async ctx => {
		await listCommand(ctx, { isBuyMode: true });
	});

	bot.command('list', listCommand);
	bot.command('keyboard', showKeyboardCommand);
	bot.command('add', addProductCommand);

	bot.action(/^edit-(.+)$/, editCommand);
	bot.action(/^buy-(.+)$/, buyCommand);

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
