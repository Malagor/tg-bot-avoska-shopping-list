import mongoose from 'mongoose';

import { v4 as uuid } from 'uuid';

const ShoppingList = mongoose.model('shoppingLists');

export class ShoppingListRepository {
	/**
	 *
	 * @param query
	 * @return {Promise<ShoppingList | null>}
	 */
	async getList(query) {
		return ShoppingList.findOne(query);
	}

	/**
	 *
	 * @param query
	 * @return {Promise<Array<ShoppingList> | null>}
	 */
	async getAllLists(query) {
		return ShoppingList.find(query);
	}

	/**
	 *
	 * @param {string} name
	 * @param {number} userId
	 * @return {Promise<ShoppingList>}
	 */
	async createList(name, userId) {
		const listId = uuid();
		return ShoppingList.create({
			uuid: listId,
			name,
			userIds: [userId],
		});
	}

	/**
	 *
	 * @param {string} listUuid
	 * @param payload
	 * @return {Promise<ShoppingList>}
	 */
	async updateList(listUuid, payload) {
		return ShoppingList.findOneAndUpdate({ uuid: listUuid }, { ...payload });
	}

	/**
	 *
	 * @param {string} listUuid
	 * @return {Promise<void>}
	 */
	async deleteList(listUuid) {
		return ShoppingList.findOneAndDelete({ uuid: listUuid });
	}

	/**
	 *
	 * @param {string} listUuid - Uuid of Shopping list
	 * @param {Array<Product>} products
	 * @return {Promise<ShoppingList>}
	 */
	async updateProducts(listUuid, products) {
		return ShoppingList.findOneAndUpdate({ uuid: listUuid }, { products });
	}
}
