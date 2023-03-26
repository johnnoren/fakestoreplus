import Product from './index.js';

export default class ProductRepository {
    async getAll() {
        const response = await fetch('https://fakestoreapi.com/products')
        const products = await response.json()
        return products.map(p => new Product(p.id, p.title, p.price, p.description, p.category, p.image, p.rating.rate, p.rating.count))
    }

}