import mongoose from 'mongoose';

import { v4 as uuid } from 'uuid';

const ProductList = mongoose.model('productLists');

export class ProductListRepository {
	/**
	 *
	 * @param query
	 * @return {Promise<ProductList | null>}
	 */
	async getList(query) {
		return ProductList.findOne(query);
	}

	async createList(name, userId) {
		return ProductList.create({
			uuid: uuid(),
			name,
			userIds: [userId],
		});
	}

	/**
	 *
	 * @param {string} listUuid - Uuid of Shopping list
	 * @param {Array<Product>} products
	 * @return {Promise<void>}
	 */
	async updateProducts(listUuid, products) {
		return ProductList.findOneAndUpdate({ uuid: listUuid }, { products });
	}
}
