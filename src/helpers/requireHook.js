import { createRequire } from 'module';
export const require = createRequire(import.meta.url);

/**
 *
 * @param {string} packName
 */
export function getRequire(packName) {
	return require(packName);
}
