export class BuildPageCommand {
    constructor(commands, models, services, controller) {
        this.commands = commands
        this.models = models
        this.services = services
        this.controller = controller
    }

    execute() {

        const templatesDiv = document.getElementById('templates');
        if (templatesDiv !== null) {
            this.#addTemplates(templatesDiv).then(() => this.#buildPage())
        } else {
            this.#buildPage(div)
        }
    }

    #buildPage() {
        const cartRepository = new this.models.CartRepository();
        const cartIconService = new this.services.CartIconService();
        const tableService = new this.services.TableService();
        const productRepository = new this.models.ProductRepository();
        const formService = new this.services.FormService();

        [...document.getElementsByTagName('div')].forEach((div) => {

            switch (div.id) {
                case 'templates': this.#addTemplates(div); break;
                case 'navbar': this.#buildNavbar(div, cartRepository); break;
                case 'footer': this.#buildFooter(div); break;
                case 'product-table': this.#buildProductTable(div, tableService, productRepository); break;
                case 'products-in-cart-table': this.#buildProductsInCartTable(div, tableService); break;
                case 'customer-details-table': this.#buildCustomerDetailsTable(div, tableService); break;
                case 'cart-product-table': this.#buildCartProductRows(tableService, cartRepository); break;
                case 'cart-summary-table': this.#buildCartSummaryTable(div, tableService, cartRepository); break;
                case 'checkout-product-table': this.#buildCheckoutProductRows(tableService, cartRepository); break;
                case 'checkout-summary-table': this.#buildCheckoutSummaryTable(div, tableService, cartRepository, formService); break;
            }
        })
    }

    async #getHtmlFromFile(url) {
        const response = await fetch(url);
        return await response.text();
    }

    async #addTemplates(div) {
        return await this.#getHtmlFromFile('./js/templates.html').then((html) => { div.innerHTML = html; });
    }

    #buildNavbar(div, cartRepository) {
        const template = document.getElementById('navbar-template').innerHTML;
        const cartItemCountAll = cartRepository.getCart().quantityOfItems;
        const render = Mustache.render(template, { cartItemCountAll: cartItemCountAll });
        div.innerHTML = render;
    }

    #buildFooter(div) {
        div.innerHTML = document.getElementById('footer-template').innerHTML;
    }

    #buildProductTable(div, tableService, productRepository) {
        productRepository.getAll().then((products) => tableService.populateProductTable(products, div, true));
    }

    #buildProductsInCartTable(div, tableService) {
        tableService.populateProductTable(JSON.parse(localStorage.getItem('products-in-cart')), div, false);
    }

    #buildCustomerDetailsTable(div, tableService) {
        tableService.populateCustomerDetailsTable(JSON.parse(localStorage.getItem('customer-details')), div);
    }

    #buildCustomerDetailsForm(div, controller, formService) {
        const form = div.getElementsByTagName('form')[0];
        form.addEventListener('submit', (event) => { controller.executeCommand(new FormSubmissionCommand(form, formService, event)) });
        form.addEventListener('change', (event) => { controller.executeCommand(new FormInputChangeCommand(event.target, formService)) });
    }

    #buildCartProductRows(tableService, cartRepository) {
        const cart = cartRepository.getCart();
        const div = document.getElementById('cart-product-table');
        const tbody = div.getElementsByTagName('tbody')[0];

        if (cart.isEmpty) {
            div.innerHTML = document.getElementById('cart-empty-template').innerHTML;
        } else {
            const template = document.getElementById('cart-product-row-template').innerHTML;
            tableService.populateCartProductRows(tbody, cart, template);
        }

        
    }

    #buildCheckoutSummaryTable(div, tableService, cartRepository, formService) {
        const cart = cartRepository.getCart();

        if (cart.isEmpty) {
            div.innerHTML = '';
        } else {
            const template = document.getElementById('checkout-summary-table-template').innerHTML;
            tableService.populateCartSummaryTable(div, cart, template);

            const div2 = document.getElementById('customer-details-form');
            this.#buildCustomerDetailsForm(div2, this.controller, formService);
        }
    }

    #buildCheckoutProductRows(tableService, cartRepository) {
        const cart = cartRepository.getCart();
        const div = document.getElementById('checkout-product-table');
        const tbody = div.getElementsByTagName('tbody')[0];

        if (cart.isEmpty) {
          //  div.innerHTML = document.getElementById('checkout-empty-template').innerHTML;
        } else {
            const template = document.getElementById('checkout-product-row-template').innerHTML;
            tableService.populateCartProductRows(tbody, cart, template);
        }

        
    }

    #buildCartSummaryTable(div, tableService, cartRepository) {
        const cart = cartRepository.getCart();

        if (cart.isEmpty) {
            div.innerHTML = '';
        } else {
            const template = document.getElementById('cart-summary-table-template').innerHTML;
            tableService.populateCartSummaryTable(div, cart, template);
        }
    }

}


export class AddToCartCommand {
    constructor(product, cartRepository, cartIconService, tableService) {
        this.product = product
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
        this.tableService = tableService
    }

    execute() { // TODO extract common code
        const cart = this.cartRepository.getCart()
        cart.addProduct(this.product)
        this.cartRepository.saveCart(cart)

        this.cartIconService.animateCartIcon()
        this.cartIconService.setBadgeCount(cart.quantityOfItems)

        if (document.getElementById('cart-product-table') !== null) {
        const tbody = document.getElementById('cart-product-table').getElementsByTagName('tbody')[0]
        const template = document.getElementById('cart-product-row-template').innerHTML;
        this.tableService.updateCartProductRows(tbody, cart, template);

        const div = document.getElementById('cart-summary-table');
        const template2 = document.getElementById('cart-summary-table-template').innerHTML;
        this.tableService.updateCartSummaryTable(div, cart, template2);
        }
    }
}


export class RemoveFromCartCommand {
    constructor(product, cartRepository, cartIconService, tableService) {
        this.product = product
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
        this.tableService = tableService
    }

    execute() { // TODO extract common code
        const cart = this.cartRepository.getCart()
        cart.removeProduct(this.product)
        this.cartRepository.saveCart(cart)

        this.cartIconService.animateCartIcon()
        this.cartIconService.setBadgeCount(cart.quantityOfItems)

        if (document.getElementById('cart-product-table') !== null) {
        const tbody = document.getElementById('cart-product-table').getElementsByTagName('tbody')[0]
        const template = document.getElementById('cart-product-row-template').innerHTML;
        this.tableService.updateCartProductRows(tbody, cart, template);

        const div = document.getElementById('cart-summary-table')
        const template2 = document.getElementById('cart-summary-table-template').innerHTML;
        this.tableService.updateCartSummaryTable(div, cart, template2)
        }
    }

}


export class FormInputChangeCommand {
    constructor(input, formService) {
        this.input = input
        this.formService = formService
    }

    execute() {
        this.formService.validateInputChange(this.input)
    }
}


export class FormSubmissionCommand {
    constructor(form, formService, event) {
        this.form = form
        this.formService = formService
        this.event = event
    }

    execute() {
        (this.formService.formInputsAreValid(this.form)) ? this.formService.saveInputs(this.form) : this.formService.stopFormSubmission(this.event)
    }
}


export class DeleteFromCartCommand {
    constructor(product, cartRepository, cartIconService, tableService) {
        this.product = product
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
        this.tableService = tableService
    }

    execute() { // TODO extract common code (to service)
        const cart = this.cartRepository.getCart()
        cart.deleteProduct(this.product)
        this.cartRepository.saveCart(cart)

        this.cartIconService.animateCartIcon()
        this.cartIconService.setBadgeCount(cart.quantityOfItems)

        const tbody = document.getElementById('cart-product-table').getElementsByTagName('tbody')[0]
        const template = document.getElementById('cart-product-row-template').innerHTML;
        this.tableService.updateCartProductRows(tbody, cart, template);

        const div = document.getElementById('cart-summary-table')
        const template2 = document.getElementById('cart-summary-table-template').innerHTML;
        this.tableService.updateCartSummaryTable(div, cart, template2)
    }

}

export class ClearCartCommand {
    constructor(commands, services, models, controller) {
        this.cartService = new services.CartService(services, models);
        this.commands = commands;
        this.services = services;
        this.models = models;
        this.controller = controller;
    }

    execute() {
        this.cartService.clearCart();

        new this.commands.BuildPageCommand(this.commands, this.models, this.services, this.controller).execute();
    }

}