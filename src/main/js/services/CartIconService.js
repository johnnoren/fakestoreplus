export default class CartIconService {

    constructor(document) {
        this.document = document
    }

    animateCartIcon() {
        const badge = this.document.querySelector('#cart-button span.badge');
        badge.classList.add('new-product');
        setTimeout(() => badge.classList.remove('new-product'),500)
    }
    
    setCartIconBadgeCount(count) {
        this.document.getElementById('cart-badge-item-counter').innerHTML = count
    }

}