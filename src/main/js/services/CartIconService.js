export default class CartIconService {

    animateCartIcon() {
        const badge = document.querySelector('#cart-button span.badge');
        badge.classList.add('new-product');
        setTimeout(() => badge.classList.remove('new-product'),500)
    }
    
    setCartIconBadgeCount(count) {
        document.getElementById('cart-badge-item-counter').innerHTML = count
    }

}