import mongoose, { Schema } from 'mongoose';

/**
 * @typedef Product
 * @type {object}
 * @property {string} uuid - an ID.
 * @property {string} title - title of product.
 * @property {number} count - count of product.
 */

/**
 * @typedef ShoppingList
 * @type {object}
 * @property {string} uuid - an ID.
 * @property {string} name - title of product list.
 * @property {Array<number>} userIds - array of users who use this list.
 * @property {Array<Product>} products - array of products
 */

const ShoppingList = new Schema({
	uuid: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	userIds: {
		type: [Number],
		default: [],
	},
	products: [
		{
			uuid: {
				type: String,
				required: true,
				unique: true,
			},
			title: {
				type: String,
				required: true,
			},
			count: Number,
		},
	],
});

mongoose.model('shoppingLists', ShoppingList);
