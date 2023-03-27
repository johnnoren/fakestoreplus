import {Product } from '../../main/js/modules/index.js';
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