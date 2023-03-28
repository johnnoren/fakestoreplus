export default class AddToCartCommand {
    constructor(product, cartRepository, cartIconService) {
        this.product = product
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
    }

    execute() {
        const cart = cartRepository.getCart()
        cart.addProduct(product)
        cartRepository.saveCart(cart)
    
        cartIconService.animateCartIcon()
        cartIconService.setCartIconBadgeCount(cart.getQuantityOfItems())
    }
}