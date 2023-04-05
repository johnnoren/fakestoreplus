export class CartIconService {

    animateCartIcon() {
        const badge = document.querySelector('#cart-icon span.badge');
        badge.classList.add('new-product');
        setTimeout(() => badge.classList.remove('new-product'), 500)
    }

    setBadgeCount(count) {
        document.getElementById('cart-badge-item-counter').innerHTML = count
    }

}


export class FormService {

    formInputsAreValid(form) {
        form.classList.add('was-validated');
        return form.checkValidity();
    }

    stopFormSubmission(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    validateInputChange(input) {
        input.classList.toggle('is-valid', input.checkValidity());
        input.classList.toggle('is-invalid', !input.checkValidity());
    }

    saveInputs(form) {
        const formValues = Object.fromEntries(new FormData(form).entries());
        localStorage.setItem(form.id, JSON.stringify(formValues));
    }

}


export class TableService {

    populateCustomerDetailsTable(customerDetails, customerDetailsTable) {
        const template = document.getElementById('customer-details-table-template').innerHTML;
        customerDetailsTable.innerHTML = Mustache.render(template, customerDetails);
    }

    populateProductTable(products, productTable, shouldBeAdjusted) {
        const cardTemplate = document.getElementById('product-card-template').innerHTML;
        const modalTemplate = document.getElementById('product-modal-template').innerHTML;

        products.forEach(p => {
            if (shouldBeAdjusted) p = this.#adjustProductForDisplay(p);
            productTable.insertAdjacentHTML('beforeend', Mustache.render(cardTemplate, p) + Mustache.render(modalTemplate, p));
        });
    }

    populateCartProductRows(tbody, cart, template) {
        cart.cartItems.forEach(cartItem => {
            this.#adjustProductForDisplay(cartItem.product, true);
            tbody.insertAdjacentHTML('beforeend', Mustache.render(template, cartItem))
        });
    }

    #adjustProductForDisplay(product, forCart = false) {
        const priceIsString = isNaN(parseFloat(product.price));
        const productPrice = (priceIsString) ? product.price : parseFloat(product.price);

        product.modalId = "modal" + product.id;
        product.rating.width = product.rating.rate / 5 * 100 + "%";
        product.rating.text = product.rating.rate + " stars (" + product.rating.count + " votes)";
        
        if (!forCart) {
            product.price = { whole: "$" + productPrice.toFixed(0), decimals: productPrice.toFixed(2).split('.')[1].substring(0, 2) };
        }
        
        product.toggleModal = "$('#" + product.modalId + "').modal('toggle');";
        product.addToCart = "addToCart(" + JSON.stringify(product) + ");";
        product.removeFromCart = "removeFromCart(" + JSON.stringify(product) + ");";
        product.deleteFromCart = "deleteFromCart(" + JSON.stringify(product) + ");";
        return product;
    }

    updateCartProductRows(tbody, cart, template) { // TODO Maybe merge this with populateCartProductRows
        tbody.innerHTML = "";
        this.populateCartProductRows(tbody, cart, template);
    }

    updateCartSummaryTable(div, cart, template) { // TODO Maybe merge this with populateCartSummaryTable
        div.innerHTML = "";
        this.populateCartSummaryTable(div, cart, template);
    }

    populateCartSummaryTable(div, cart, template) {
        const shippingCost = 10;
        const cartTotal = (parseFloat(cart.total) + shippingCost).toFixed(2);
        const clearCart = "clearCart();";

        div.innerHTML = Mustache.render(template, { cart: cart, shippingCost: shippingCost, total: cartTotal, clearCart: clearCart });
    }

}

export class CartService {
        constructor(services, models) {
            this.cartRepository = new models.CartRepository();
            this.cartIconService = new services.CartIconService();
        }

    clearCart() {
        const cart = this.cartRepository.getCart();
        cart.clearCart();
        this.cartRepository.saveCart(cart);
    }

    getCartItemCount() {
        return this.cartRepository.getCart().cartItems.length;
    }

}
