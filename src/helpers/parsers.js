import { v4 as uuid } from 'uuid';
/**
 *
 * @param {string} products
 * @return {Array<Product>}
 */
export function parseProductList(products) {
	return products.split('\n').map(parseProduct);
}

/**
 *
 * @param {string} product
 * @return {Product}
 */
export function parseProduct(product) {
	const arrayOfWords = product.split(' ');

	const count = hasCount(arrayOfWords) ? Number(arrayOfWords.pop()) : 1;

	const title = arrayOfWords.join(' ').trim();

	return {
		uuid: uuid(),
		title,
		count,
	};
}

/**
 *
 * @param {Array<string>} productString
 * @return {boolean}
 */
function hasCount(productString) {
	if (productString.length < 2) {
		return false;
	}

	const lastItem = productString[productString.length - 1];

	return !isNaN(Number(lastItem));
}
