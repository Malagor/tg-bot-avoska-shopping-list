export const COMMANDS = {
	start: 'start',
	help: 'help',
	list: 'list',
	keyboard: 'keyboard',
	add: 'add',
	showLists: 'showlists',
	cancel: 'cancel',
};

/**
 * @typedef BotCommand
 * @type {object}
 * @property {string} command
 * @property {string} description
 */

/**
 * @constant
 * @type {Array<BotCommand>}
 */
export const botCommands = [
	{ command: COMMANDS.start, description: 'Начало работы с ботом' },
	{ command: COMMANDS.help, description: 'Помощь' },
	{ command: COMMANDS.list, description: 'Вывести текущий список покупок' },
	{ command: COMMANDS.keyboard, description: 'Отобразить клавиатуру' },
	{ command: COMMANDS.add, description: 'Добавить продукты' },
	{ command: COMMANDS.showLists, description: 'Страница списков' },
	{ command: COMMANDS.cancel, description: 'Отмена текущей операции' },
];
