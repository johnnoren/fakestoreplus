import { CartItem, Product } from '../../main/js/models/index.js';
import {jest} from '@jest/globals';
jest.useFakeTimers();

import productData from '../resources/product/product_id_1.json';
const product = Product.fromJSON(productData);

const cartItem = new CartItem(product, 1)

test('Increase quantity', () => {
    cartItem.increaseQuantity()
    expect(cartItem.quantity).toBe(2)
})

test('Decrease quantity', () => {
    cartItem.decreaseQuantity()
    expect(cartItem.quantity).toBe(1)
})

test('Decrease quantity below zero', () => {
    cartItem.decreaseQuantity()
    expect(cartItem.quantity).toBe(0)
})