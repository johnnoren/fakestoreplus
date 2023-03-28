import {Product } from '../../main/js/modelss/index.js';
import {jest} from '@jest/globals';
jest.useFakeTimers();

import product1Data from '../resources/product/product_id_1.json';
import product2Data from '../resources/product/product_id_2.json';
const newProduct1 = () => Product.fromJSON(product1Data);
const newProduct2 = () => Product.fromJSON(product2Data);

test('Product equality', () => {
    const product1 = newProduct1()
    const product2 = newProduct1()
    expect(product1.equals(product2)).toBe(true)
})

test('Product equality', () => {
    const product1 = newProduct1()
    const product2 = newProduct2()
    expect(product1.equals(product2)).toBe(false)
})

test('Product fromJSON', () => {
    const product1 = new Product(product1Data.id, product1Data.title, product1Data.price, product1Data.description, product1Data.category, product1Data.image, product1Data.rating, product1Data.count)
    const product2 = Product.fromJSON(product1Data)
    expect(product1.equals(product2)).toBe(true)
})