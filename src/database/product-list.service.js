import { ProductListRepository } from './product-list.repository.js';
import { createQueryForProductLists } from '../helpers/product-list-service.helper.js';

class ProductListService {
	repository;

	/**
	 *
	 * @param {ProductListRepository} repository
	 */
	constructor(repository) {
		this.repository = repository;
	}

	static instance;

	static getInstance() {
		if (!ProductListService.instance) {
			ProductListService.instance = new ProductListService(new ProductListRepository());
		}

		return ProductListService.instance;
	}

	/**
	 *
	 * @param userId
	 * @return {Promise<ProductList>}
	 */
	async getProductListByUserId(userId) {
		try {
			return this.repository.getList(createQueryForProductLists(userId));
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} uuid
	 * @return {Promise<ProductList>}
	 */
	async getProductListByUuid(uuid) {
		try {
			return this.repository.getList({ uuid });
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} name
	 * @param {number} userId
	 * @return {Promise<*>}
	 */
	async createList(name, userId) {
		try {
			return this.repository.createList(name, userId);
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} listId
	 * @param {Array<Product>} products
	 * @return {Promise<void>}
	 */
	async addProducts(listId, products) {
		try {
			const list = await this.repository.getList({ uuid: listId });

			const productList = [...list.products, ...products];

			await this.repository.updateProducts(listId, productList);
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} listId
	 * @param {Product} product
	 * @return {Promise<void>}
	 */
	async updateProduct(listId, product) {
		try {
			const list = await this.repository.getList({ uuid: listId });

			const productList = [...list.products];

			const index = productList.findIndex(p => p.uuid === product.uuid);

			productList[index] = product;

			await this.repository.updateProducts(listId, productList);
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} listId
	 * @param {string} productUuid
	 * @return {Promise<void>}
	 */
	async deleteProduct(listId, productUuid) {
		try {
			const list = await this.repository.getList({ uuid: listId });

			const productList = list.products.filter(p => p.uuid !== productUuid);

			await this.repository.updateProducts(listId, productList);
		} catch (e) {
			console.log(e);
		}
	}
}

export const productListService = ProductListService.getInstance();
