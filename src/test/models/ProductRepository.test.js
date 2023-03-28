import {ProductRepository, Product} from '../../main/js/models/index.js';
import {jest} from '@jest/globals';
jest.useFakeTimers();

import mockProductData from '../resources/product/multiple_products.json';

// Mock the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockProductData),
    })
);

const productRepository = new ProductRepository()

test('Get all products', async () => {
    const products = await productRepository.getAll()
    expect(products.length).toBe(20)
})

test('Get all products', async () => {
    const actualProducts = await productRepository.getAll()
    const expectedProducts = mockProductData.map(p => new Product(p.id, p.title, p.price, p.description, p.category, p.image, p.rating.rate, p.rating.count))
    expect(actualProducts).toEqual(expectedProducts)
})