export class Cart {
    cartItems

    constructor(cartItems = []) {
        this.cartItems = cartItems
    }

    #containsProduct(product) {
        return this.cartItems.map((cartItem) => cartItem.product).some((cartItemProduct) => cartItemProduct.equals(product))
    }

    #getCartItem(product) {
        return this.cartItems.find((cartItem) => cartItem.product.equals(product))
    }

    addProduct(product) {
        if (this.#containsProduct(product)) {
            this.#getCartItem(product).increaseQuantity()
        } else {
            this.cartItems.push(new CartItem(product))
        }
    }

    removeProduct(product) {
        if (this.#containsProduct(product)) {
            this.#getCartItem(product).decreaseQuantity()
            this.#removeEmptyCartItems()
        }
    }

    getQuantityOfItems() { return this.cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0) }

    #removeCartItems(itemsToDelete) {
        this.cartItems = this.cartItems.filter((cartItem) => !itemsToDelete.includes(cartItem))
    }

    #removeEmptyCartItems() {
        this.#removeCartItems(this.cartItems.filter((cartItem) => cartItem.quantity === 0))
    }

    static from(json){
        return new Cart(JSON.parse(json)["cartItems"])
    }

}


export class CartItem {
    product
    quantity

    constructor(product, quantity = 1) {
        this.product = product
        this.quantity = quantity
    }

    increaseQuantity() {
        this.quantity += 1
    }

    decreaseQuantity() {
        return (this.quantity === 0) ? 0 : this.quantity -= 1
    }
}


export class CartRepository {

    cartStorageKey

    constructor(cartStorageKey) {
        this.cartStorageKey = cartStorageKey
    }

    #createCartIfNotExists = () => {
        if (localStorage.getItem(this.cartStorageKey) === null) { localStorage.setItem(this.cartStorageKey, JSON.stringify(new Cart())) }
    }

    getCart() {
        this.#createCartIfNotExists()
        return Cart.from(localStorage.getItem(this.cartStorageKey))
    }

    saveCart(cart) {
        localStorage.setItem(this.cartStorageKey, JSON.stringify(cart))
    }

    deleteCart() {
        localStorage.removeItem(this.cartStorageKey)
    }
}


export class Product {
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


export class ProductRepository {
    async getAll() {
        const response = await fetch('https://fakestoreapi.com/products')
        const products = await response.json()
        return products.map(p => new Product(p.id, p.title, p.price, p.description, p.category, p.image, p.rating.rate, p.rating.count))
    }

}