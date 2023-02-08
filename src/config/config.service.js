import * as dotenv from 'dotenv';

dotenv.config();

/**
 *
 * @param {string} field
 * @return {string}
 */
export function getConfig(field) {
	const res = process.env[field];
	if (!res) {
		throw new Error(`В файле конфигурации нет поля ${field}`);
	}

	return res;
}
