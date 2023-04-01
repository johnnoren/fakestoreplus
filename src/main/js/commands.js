export class BuildPageCommand {
    constructor(cartRepository, cartIconService, tableService) {
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
        this.tableService = tableService
    }
    
    execute() {
        [...document.getElementsByTagName('div')].forEach((div) => {
            switch (div.id) {
                case 'templates': this.#addTemplates(div); break;
                case 'navbar': this.#buildNavbar(div); break;
                case 'cart-icon': this.#buildCartIcon(); break;
                case 'footer': this.#buildFooter(div); break;
                case 'product-table': this.#buildProductTable(div); break;
                case 'products-in-cart-table': this.#buildProductsInCartTable(div); break;
                case 'customer-details-table': this.#buildCustomerDetailsTable(div); break;
            }
        })
    }

    #getHtmlFromFile(url) {
        fetch(url).then((response) => response.text()).then((html) => html);
    }

    #addTemplates(div) {
        div.innerHTML = this.#getHtmlFromFile('templates.html');
    }

    #buildNavbar(div) {
        div.innerHTML = document.getElementById('navbar-template').innerHTML;
    }

    #buildCartIcon() {
        const cartItemCount = this.cartRepository.getCart().getQuantityOfItems();
        this.cartIconService.setCartIconBadgeCount(cartItemCount);
    }

    #buildFooter(div) {
        div.innerHTML = document.getElementById('footer-template').innerHTML;
    }

    #buildProductTable(div) {
        this.tableService.populateProductTable(JSON.parse(localStorage.getItem('products')), div);
    }

    #buildProductsInCartTable(div) {
        this.tableService.populateProductTable(JSON.parse(localStorage.getItem('products-in-cart')), div, false);
    }

    #buildCustomerDetailsTable(div) {
        this.tableService.populateCustomerDetailsTable(JSON.parse(localStorage.getItem('customer-details')), div);
    }

}


export class AddToCartCommand {
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


export class FormInputChangeCommand {
    constructor(input, formService) {
        this.input = input
        this.formService = formService
    }

    execute() {
        formService.validateInput(input)
    }
}


export class FormSubmissionCommand {
    constructor(form, formService, event) {
        this.form = form
        this.formService = formService
        this.event = event
    }

    execute() { 
        (formService.formInputsAreValid(form)) ? formService.saveInputs(form) : formService.stopFormSubmission(event) 
    }
}


export class RemoveFromCartCommand {
    constructor(product, cartRepository, cartIconService) {
        this.product = product
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
    }

    execute() {
        const cart = cartRepository.getCart()
        cart.removeProduct(product)
        cartRepository.saveCart(cart)
    
        cartIconService.setCartIconBadgeCount(cart.getQuantityOfItems())
    }
}