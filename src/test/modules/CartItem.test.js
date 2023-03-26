import { CartItem, Product } from '../../main/js/modules/index.js';
import {jest} from '@jest/globals';

jest.useFakeTimers();


// const productData = require('../resources/product/fjallraven_foldsack.json')
import productData from '../resources/product/fjallraven_foldsack.json';
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