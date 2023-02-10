/**
 *
 * @param {ShoppingList} list
 * @param {{isCurrent: boolean}} options
 * @return {string}
 */
export function formatListInfoHTML(list, { isCurrent } = {}) {
	const currentText = isCurrent ? ' - текущий' : '';
	const count = getProductCount(list);
	if (isPrivate(list)) {
		return `<b>${list.name}</b> (${count})${currentText}`;
	} else {
		return `<i>${list.name}</i> (${count}) - shared${currentText}`;
	}
}

/**
 *
 * @param {ShoppingList} list
 * @return {boolean}
 */
function isPrivate(list) {
	return list.userIds.length === 1;
}
/**
 *
 * @param {ShoppingList} list
 * @return {number}
 */
function getProductCount(list) {
	return list.products.length;
}
