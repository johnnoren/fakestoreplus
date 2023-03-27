export default class Product {
    id
    title
    price
    description
    category
    image
    rating
    count

    constructor(id, title, price, description, category, image, rating, count) {
        this.id = id
        this.title = title
        this.price = price
        this.description = description
        this.category = category
        this.image = image
        this.rating = rating
        this.count = count
    }

    static fromJSON(json) {
        return new Product(json.id, json.title, json.price, json.description, json.category, json.image, json.rating, json.count)
    }

    equals(other) {
        const keys = Object.keys(this);
        return (keys.length !== Object.keys(other).length) ? false : keys.every(key => this[key] === other[key]);
        }
}

