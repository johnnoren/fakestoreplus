import { BuildPageCommand, FormInputChangeCommand, FormSubmissionCommand } from "./commands/index.js";
import { CartRepository } from "./models/index.js";
import { FormService, CartIconService } from "./services/index.js";

executeCommand(new BuildPageCommand(new CartRepository(), new CartIconService()))

(function initListeners() {
    document.querySelectorAll('needs-listener').forEach((div) => {
        switch (div.id) {
            case 'customer-details-form': {
                div.addEventListener('submit', (event) => { executeCommand(new FormSubmissionCommand(form, new FormService(form), event)) });
                div.addEventListener('change', (event) => { executeCommand(new FormInputChangeCommand(event.target, new FormService(form))) });
            }
        }
    })
})();






    // Tables
    document.querySelectorAll('div').forEach((div) => {
        switch (div.id) {
            case 'product-table': getProductsFromAPI().then((products) => populateProductTable(products, div)); break;
            case 'products-in-cart-table': populateProductTable([JSON.parse(localStorage.getItem('product'))], div, false); break;
            case 'customer-details': populateCustomerDetailsTable(JSON.parse(localStorage.getItem('customer-details')), div); break;
        }
    })









function executeCommand(command) {
    command.execute()
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






// Not used?
function showModal(text) {
    document.querySelector('.modal-title').innerHTML = text;
    new bootstrap.Modal(document.getElementById('add-to-cart-modal')).show();
}





