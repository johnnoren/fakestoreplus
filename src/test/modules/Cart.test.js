import { Cart, CartItem, Product } from '../../main/js/modules/index.js';
import {jest} from '@jest/globals';
jest.useFakeTimers();

import product1Data from '../resources/product/product_id_1.json';
import product2Data from '../resources/product/product_id_2.json';
const newProduct1 = () => Product.fromJSON(product1Data);
const newProduct2 = () => Product.fromJSON(product2Data);

const newCartItem1 = () => new CartItem(newProduct1(), 1)
const newCartItem2 = () => new CartItem(newProduct2(), 5)

const newCart1 = () => new Cart([newCartItem1()])
const newCart2 = () => new Cart([newCartItem2()])

test('Add product', () => {
    const cart = newCart1()
    cart.addProduct(newProduct1())
    expect(cart.getQuantityOfItems()).toBe(2)
})

test('Add product', () => {
    const cart = newCart1()
    cart.addProduct(newProduct2())
    cart.addProduct(newProduct2())
    cart.addProduct(newProduct2())
    cart.addProduct(newProduct2())
    cart.addProduct(newProduct2())
    cart.addProduct(newProduct2())
    expect(cart.getQuantityOfItems()).toBe(7)
})

test('Remove product', () => {
    const cart = newCart2()
    cart.removeProduct(newProduct1())
    expect(cart.getQuantityOfItems()).toBe(5)
})

test('Remove product', () => {
    const cart = newCart2()
    cart.removeProduct(newProduct2())
    cart.removeProduct(newProduct2())
    expect(cart.getQuantityOfItems()).toBe(3)
})

test('Remove product', () => {
    const cart = newCart1()
    cart.removeProduct(newProduct1())
    cart.removeProduct(newProduct1())
    expect(cart.getQuantityOfItems()).toBe(0)
})
