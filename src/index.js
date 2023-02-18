import { getConfig } from './config/config.service.js';

import mongoose from 'mongoose';
import './models/index.js';
import Bot from './bot.js';

mongoose.set('strictQuery', false);
mongoose
	.connect(getConfig('DB_URL'), {
		dbName: getConfig('DB_NAME'),
	})
	.then(() => {
		console.log('Connection to the database was successful!');
	})
	.then(async () => {
		Bot.getInstance(getConfig('BOT_TOKEN'));
	})
	.catch(e => {
		console.log(e);
	});
