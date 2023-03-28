import { FormInputChangeCommand, FormSubmissionCommand } from "./commands/index.js";
import { CartRepository } from "./models/index.js";
import { FormService } from "./services/index.js";


const saveToLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));



// setCartIconBadgeCount(getCart().getQuantityOfItems()) <- What to do with this? It should be called when the page loads and when the cart changes.


function populateCustomerDetailsTable(customerDetails, customerDetailsDiv) {
    Object.keys(customerDetails).forEach((key) => {
        const row = document.querySelector('.customer-details-table-row').cloneNode(true)

        row.querySelector('.customer-details-table-property-name').innerHTML = (key.charAt(0).toUpperCase() + key.slice(1) + ':').replace(/-/g, " ")
        row.querySelector('.customer-details-table-property-value').innerHTML = customerDetails[key]

        row.classList.remove('d-none')
        customerDetailsDiv.querySelector('.customer-details-table').appendChild(row)
    });
}

// remove change so that you get to cart page by clicking the cart button in the header
function buyProduct(product) {
    saveToLocalStorage('product', product);
    window.location = 'order.html';
}

function populateProductTable(products, productTable, showBuyButton = true) {
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



(function initForms() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', (event) => { new FormSubmissionCommand(form, new FormService(form), event) });
        form.addEventListener('change', (event) => { new FormInputChangeCommand(event.target, new FormService(form)) });
    })
})();

(function initTables() {
    const divs = document.querySelectorAll('div')

    divs.forEach((div) => {
        switch (div.id) {
            case 'product-table': getProductsFromAPI().then((products) => populateProductTable(products, div)); break;
            case 'products-in-cart-table': populateProductTable([loadFromLocalStorage('product')], div, false); break;
            case 'customer-details': populateCustomerDetailsTable(loadFromLocalStorage('customer-details'), div); break;
        }
    })
})();

// Not used?
function showModal(text) {
    document.querySelector('.modal-title').innerHTML = text;
    new bootstrap.Modal(document.getElementById('add-to-cart-modal')).show();
}





function executeCommand(command) {
    command.execute()
}