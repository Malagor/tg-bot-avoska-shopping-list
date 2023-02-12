import { ShoppingListRepository } from './shopping-list.repository.js';
import { createQueryForShoppingLists } from '../helpers/shopping-list-service.helper.js';

/**
 * Class representing a ShoppingListService.
 */
class ShoppingListService {
	/**
	 *
	 * @param {ShoppingListRepository} repository
	 */
	constructor(repository) {
		this.repository = repository;
	}

	/**
	 * @type {ShoppingListService}
	 * @static
	 */
	static instance;

	/**
	 * Generates ShoppingListService instances.
	 * @static
	 */
	static getInstance() {
		if (!ShoppingListService.instance) {
			ShoppingListService.instance = new ShoppingListService(new ShoppingListRepository());
		}

		return ShoppingListService.instance;
	}

	/**
	 *
	 * @param userId
	 * @return {Promise<Array<ShoppingList>|null>}
	 */
	async getAllShoppingListsByUserId(userId) {
		try {
			return this.repository.getAllLists(createQueryForShoppingLists(userId));
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} uuid
	 * @return {Promise<ShoppingList>}
	 */
	async getShoppingListByUuid(uuid) {
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
	 * @return {Promise<ShoppingList>}
	 */
	async createList(name, userId) {
		try {
			return this.repository.createList(name, userId);
		} catch (e) {
			console.log(e);
		}
	}

	async deleteList(uuid) {
		try {
			await this.repository.deleteList(uuid);
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
	 * @return {Promise<ShoppingList>}
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
	 * @param {string} listUuid
	 * @param {string} name
	 * @return {Promise<ShoppingList>}
	 */
	async updateListName(listUuid, name) {
		try {
			return this.repository.updateList(listUuid, { name });
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 *
	 * @param {string} listUuid
	 * @param {Array<number>} userIds
	 * @return {Promise<ShoppingList>}
	 */
	async updateUsers(listUuid, userIds) {
		try {
			return this.repository.updateList(listUuid, { userIds });
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

/**
 * @constant
 * @type {ShoppingListService}
 */
export const shoppingListService = ShoppingListService.getInstance();
