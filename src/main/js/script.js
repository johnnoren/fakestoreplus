const CART_STORAGE_KEY = 'fakeStoreCart';

class CartItem {
    product
    quantity

    constructor(product, quantity = 1) {
        this.product = product
        this.quantity = quantity
    }

    increaseQuantity() {
        this.quantity += 1
    }

    decreaseQuantity() {
        return (this.quantity === 0) ? 0 : this.quantity -= 1
    }
}

class Cart {
    cartItems

    constructor(cartItems = []) {
        this.cartItems = cartItems
    }

    #containsProduct(product) {
        // return (this.cartItems === undefined) ? false : this.cartItems.map((cartItem) => cartItem.product).includes(product)
        return this.cartItems.map((cartItem) => cartItem.product).includes(product)
    }

    #getCartItem(product) {
        return this.cartItems.find((cartItem) => cartItem.product === product)
    }

    addProduct(product) {
        if (this.#containsProduct(product)) {
            this.#getCartItem(product).increaseQuantity()
        } else {
            this.cartItems.push(new CartItem(product))
        }
    }

    removeProduct(product) {
        if (this.#containsProduct(product)) {
            this.#getCartItem(product).decreaseQuantity()
            this.#removeEmptyCartItems()
        }
    }

    getQuantityOfItems() { return this.cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0) }

    #removeCartItems(itemsToDelete) {
        this.cartItems = this.cartItems.filter((cartItem) => !itemsToDelete.includes(cartItem))
    }

    #removeEmptyCartItems() {
        this.#removeCartItems(this.cartItems.filter((cartItem) => cartItem.quantity === 0))
    }

    static from(json){
        return new Cart(JSON.parse(json)["cartItems"])
    }

}

async function getProductsFromAPI() {
    return (await fetch('https://mocki.io/v1/a99e6cf4-1e5a-4b0e-bc57-6c651f0f09cd')).json();
}

const saveToLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

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

const validationPatterns = {
    'email': /^(?=.{1,50}$)[^@]+@[^@]+$/i,
    'phone': /^(?=.{1,50}$)(\d|-|\(|\))+$/i,
    'full-name': /^.{2,50}$/i,
    'street-and-number': /^.{1,50}$/i,
    'postal-code': /^[0-9]{3} [0-9]{2}$/i,
    'city': /^.{2,50}$/i,
};

(function initForms() {
    const markInputAsValid = (input) => { input.classList.add('is-valid'); input.classList.remove('is-invalid'); return true }
    const markInputAsInValid = (input) => { input.classList.add('is-invalid'); input.classList.remove('is-valid'); return false }
    const validateSingleInput = (input) => validationPatterns[input.id].test(input.value) ? markInputAsValid(input) : markInputAsInValid(input)
    const getFormInputs = () => Array.from(document.querySelectorAll('.form-input'));
    const allInputsAreValid = () => getFormInputs().every((input) => validateSingleInput(input))
    const getInputsAsObject = () => Object.fromEntries(getFormInputs().map((input) => [input.id, input.value]))
    const forms = Array.from(document.querySelectorAll('.needs-validation'));

    forms.forEach((form) => {
        form.addEventListener('submit', (event) => allInputsAreValid() ? saveToLocalStorage(form.id, getInputsAsObject()) : event.preventDefault());
        form.addEventListener('change', (event) => validateSingleInput(event.target, validationPatterns[event.target.attributes.id.value]));
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



//  --- Cart ---

function animateCartIcon() {
    const badge = document.querySelector('#cart-button span.badge');
    badge.classList.add('new-product');
    setTimeout(() => badge.classList.remove('new-product'),500)
}

function setCartIconBadgeCount(count) {
    document.getElementById('cart-badge-item-counter').innerHTML = count
}

(function initCart() {
    if (localStorage.getItem(CART_STORAGE_KEY) === null) { saveToLocalStorage(CART_STORAGE_KEY, new Cart()) }
    setCartIconBadgeCount(getCart().getQuantityOfItems())
})();

function getCart() {
    return Cart.from(localStorage.getItem(CART_STORAGE_KEY))
}

function addToCart(product) {
    const cart = getCart()
    cart.addProduct(product)
    saveToLocalStorage(CART_STORAGE_KEY, cart)
    animateCartIcon()
    setCartIconBadgeCount(cart.getQuantityOfItems())
}

function removeFromCart(product) {
    const cart = getCart()
    cart.removeProduct(product)
    saveToLocalStorage(CART_STORAGE_KEY, cart)
    setCartIconBadgeCount(cart.getQuantityOfItems())
}

function sum(a, b) {
    return a + b;
}