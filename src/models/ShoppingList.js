import { icons } from '../constants/signs.constant.js';

/**
 * @typedef ShoppingListProps
 * @type {object}
 * @property {string} uuid - an ID.
 * @property {string} name - title of product list.
 * @property {Array<number>} userIds - array of users who use this list.
 * @property {Array<Product>} [products] - array of products
 */

export default class ShoppingList {
	/**
	 * @constructor
	 * @param {ShoppingListProps} list
	 */
	constructor(list) {
		this.uuid = list.uuid;
		this.name = list.name;
		this.userIds = list.userIds || [];
		this.products = list.products || [];
	}

	/**
	 *
	 * @param {string} currentListId
	 * @param {number} userId
	 * @return {string}
	 */
	toHtml(currentListId, userId) {
		const currentIcon = this.isCurrent(currentListId) ? `${icons.current} ` : '';
		const count = this.products.length;
		const tag = this.isOwner(userId) ? 'b' : 'i';

		if (this.isPrivate()) {
			return `${currentIcon}<${tag}>${this.name}</${tag}> (${count})`;
		} else {
			return `${currentIcon}<${tag}>${this.name}</${tag}> (${count}) ${icons.share}(общий)`;
		}
	}

	/**
	 *
	 * @param {number} idx
	 * @return {{id: number,
			type: 'article',
			title: string,
			input_message_content: {
				message_text: string,
			}}
			}
	 */
	toInlineQueryAnswer(idx) {
		return {
			id: idx + 1,
			type: 'article',
			title: `${this.name} (${this.products.length})`,
			input_message_content: {
				message_text: `Список: ${this.name}:\n` + this.formatProductListAsString(),
			},
		};
	}

	madePrivate() {
		this.userIds = this.userIds[0];
	}

	isOwner(userId) {
		return this.userIds[0] === userId;
	}

	isPrivate() {
		return this.userIds.length === 1;
	}

	isCurrent(id) {
		return this.uuid === id;
	}

	formatProductListAsString() {
		return this.products.map(product => product.toText()).join('\n') || 'Нет продуктов для обображения';
	}
}
