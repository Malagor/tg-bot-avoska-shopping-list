import mongoose, { Schema } from 'mongoose';
import ShoppingList from './ShoppingList.js';
import Product from './Product.js';

const productSchema = new Schema({
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
});

productSchema.loadClass(Product);

const shoppingListSchema = new Schema({
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
	products: [productSchema],
});

shoppingListSchema.loadClass(ShoppingList);

mongoose.model('shoppingLists', shoppingListSchema);
