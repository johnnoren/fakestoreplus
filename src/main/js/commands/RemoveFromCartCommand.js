export default class RemoveFromCartCommand {
    constructor(product, cartRepository, cartIconService) {
        this.product = product
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
    }

    execute() {
        const cart = cartRepository.getCart()
        cart.removeProduct(product)
        cartRepository.saveCart(cart)
    
        cartIconService.setCartIconBadgeCount(cart.getQuantityOfItems())
    }
}