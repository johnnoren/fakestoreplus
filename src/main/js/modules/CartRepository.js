import {Cart} from './index.js';

export default class CartRepository {

    cartStorageKey

    constructor(cartStorageKey) {
        this.cartStorageKey = cartStorageKey
    }

    #createCartIfNotExists = () => {
        if (localStorage.getItem(cartStorageKey) === null) { localStorage.setItem(cartStorageKey, JSON.stringify(new Cart())) }
    }

    getCart() {
        this.#createCartIfNotExists(cartStorageKey)
        return Cart.from(localStorage.getItem(cartStorageKey))
    }

    saveCart(cart) {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart))
    }

    deleteCart() {
        localStorage.removeItem(cartStorageKey)
    }
}