export class CartIconService {

    constructor(document) {
        this.document = document
    }

    animateCartIcon() {
        const badge = this.document.querySelector('#cart-icon span.badge');
        badge.classList.add('new-product');
        setTimeout(() => badge.classList.remove('new-product'), 500)
    }

    setCartIconBadgeCount(count) {
        this.document.getElementById('cart-badge-item-counter').innerHTML = count
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

    #adjustProductForDisplay(product) {
        product.modalId = "modal" + product.id;
        product.rating.width = product.rating.rate / 5 * 100 + "%";
        product.rating.text = product.rating.rate + " stars (" + product.rating.count + " votes)";
        product.price = { whole: "$" + product.price.toFixed(0), decimals: product.price.toFixed(2).split('.')[1].substring(0, 2) };
        product.toggleModal = "$('#" + product.modalId + "').modal('toggle');";
        product.buyProduct = "addToCart(" + JSON.stringify(product) + ");";
        return product;
    }
}