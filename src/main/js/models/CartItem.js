export default class CartItem {
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