import {Cart} from './index.js';

export default class CartRepository {

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