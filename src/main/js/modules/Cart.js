import {CartItem} from './index.js';

export default class Cart {
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