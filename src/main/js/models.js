export class CartItem {
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

    get itemTotal() {
        const priceString = (this.product.price.whole + '.' + this.product.price.decimals).slice(1)
        const price = parseFloat(priceString)
        return parseFloat((price * this.quantity).toFixed(2))
    }

}

export class Cart {
    constructor(cartItems = []) {
        this.cartItems = cartItems
    }

    #containsProduct(product) {
        return this.cartItems.map((cartItem) => cartItem.product).some((cartItemProduct) => cartItemProduct.id == product.id)
    }

    #getCartItem(product) {
        return this.cartItems.find((cartItem) => cartItem.product.id == product.id)
    }

    addProduct(product) {
        if (this.#containsProduct(product)) {
            this.#getCartItem(product).increaseQuantity();
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

    deleteProduct(product) {
        if (this.#containsProduct(product)) {
            this.#getCartItem(product).quantity = 0;
            this.#removeEmptyCartItems()
        }
    }

    clearCart() {
        this.cartItems = [];
    }

    get quantityOfItems() {
        return this.cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0)
    }

    get total() {
        return this.cartItems.reduce((acc, cartItem) => acc + cartItem.itemTotal, 0).toFixed(2)
    }

    get isEmpty() {
        return this.cartItems.length === 0
    }

    #removeCartItems(itemsToDelete) {
        this.cartItems = this.cartItems.filter((cartItem) => !itemsToDelete.includes(cartItem))
    }

    #removeEmptyCartItems() {
        this.#removeCartItems(this.cartItems.filter((cartItem) => cartItem.quantity === 0))
    }

    static from(json){
        const parsedJson = JSON.parse(json);
        const cartItems = parsedJson.cartItems.map(cartItem => new CartItem(cartItem.product, cartItem.quantity));
        return new Cart(cartItems);
    }
    

}

export class CartRepository {
    constructor(cartStorageKey = 'defaultCart') {
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

export class ProductRepository {
    async getAll() {
        const response = await fetch('https://fakestoreapi.com/products')
        const products = await response.json()
        return products
    }

}