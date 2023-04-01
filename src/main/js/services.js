export class CartIconService {

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

    populateProductTable(products, productTable, showBuyButton = true) {
        products.forEach(p => {
    
            const row = document.querySelector('.product-col').cloneNode(true)
            const modal = document.querySelector('.modal').cloneNode(true)
            modal.id = 'modal' + p.id;
            modal.querySelector('.btn-close').addEventListener('click', () => {
                $('#modal' + p.id).modal('toggle');
            });
    
            [row, modal].forEach(e => {
                e.querySelector('.product-title').innerHTML = p.title;
                e.querySelector('.description').innerHTML = p.description;
                e.querySelector('.product-table-image').src = p.image;
                e.querySelector('.product-table-image').alt = 'Image of ' + p.title;
                e.querySelector('.rating-upper').style.width = p.rating.rate / 5 * 100 + "%"
                e.querySelector('.rating-text').innerHTML = p.rating.rate + " stars (" + p.rating.count + " votes)"
                e.querySelector('.price').innerHTML = "$" + p.price.toFixed(0)
                e.querySelector('.decimals').innerHTML = (((p.price - Math.floor(p.price)) * 100) + "0").substring(0, 2);
            })
    
            row.addEventListener('click', () => {
                $('#modal' + p.id).modal('toggle');
            });
    
            row.querySelector('.category').innerHTML = p.category
    
            if (showBuyButton) {
                [row, modal].forEach(e => {
                    e.querySelector('.add-to-cart-button').addEventListener("mousedown", () => addToCart(p))
                });
            } else {
                [row, modal].forEach(e => {
                    e.querySelector('.add-to-cart-button').classList.add('d-none')
                });
            }
    
            row.classList.remove('d-none')
            productTable.appendChild(row)
            productTable.appendChild(modal);
    
        });
    
    }
}