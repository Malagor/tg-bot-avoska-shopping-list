import { getConfig } from './config/config.service.js';

import mongoose from 'mongoose';
import './models/index.js';
import { runBot } from './bot.js';

mongoose.set('strictQuery', false);
mongoose
	.connect(getConfig('DB_URL'), {
		dbName: getConfig('DB_NAME'),
	})
	.then(() => {
		console.log('Connection to the database was successful!');
	})
	.then(async () => {
		await runBot();
	})
	.catch(e => {
		console.log(e);
	});
