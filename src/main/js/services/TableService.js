export default class TableService {
    populateCustomerDetailsTable(customerDetails, customerDetailsDiv) {
        const rowTemplate = customerDetailsDiv.querySelector('tr');

        Object.entries(customerDetails).forEach(([key, value]) => {
            const row = rowTemplate.cloneNode(true);
            
            row.cells[0].textContent = key.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) + ':'; // Capitalize first letter and replace dashes with spaces
            row.cells[1].textContent = value;
            row.classList.remove('d-none');
            
            customerDetailsDiv.firstElementChild.appendChild(row);
        });
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