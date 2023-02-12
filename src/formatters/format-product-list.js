/**
 * @param {Product} product
 * @return {string}
 */
export function formatProductHTML(product) {
	return `<b>${product.title}</b> : ${product.count}`;
}

/**
 * @param {Product} product
 * @return {string}
 */
export function formatProductText(product) {
	return `${product.title} : ${product.count}`;
}
