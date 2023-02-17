import { v4 as uuid } from 'uuid';

export default class Product {
	constructor(product) {
		this.uuid = product.uuid || uuid();
		this.title = product.title;
		this.count = product.count;
	}

	/**
	 * Format product to text string
	 * @return {string}
	 */
	toText() {
		return `${this.title} : ${this.count}`;
	}

	/**
	 * Format product to HTML string
	 * @return {string}
	 */
	toHtml() {
		return `<b>${this.title}</b> : ${this.count}`;
	}
}
