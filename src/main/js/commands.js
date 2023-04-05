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
                case 'customer-details-form': this.#buildCustomerDetailsForm(div, this.controller, formService); break;
                case 'cart-product-table': this.#buildCartProductRows(tableService, cartRepository); break;
                case 'cart-summary-table': this.#buildCartSummaryTable(div, tableService, cartRepository); break;
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
        const form = div.getElementById('form');
        form.addEventListener('submit', (event) => { controller.executeCommand(new FormSubmissionCommand(form, formService(form), event)) });
        form.addEventListener('change', (event) => { controller.executeCommand(new FormInputChangeCommand(event.target, formService(form))) });
    }

    #buildCartProductRows(tableService, cartRepository) {
        const cart = cartRepository.getCart();
        const div = document.getElementById('cart-product-table');
        const tbody = div.getElementsByTagName('tbody')[0];

        if (cart.isEmpty) {
            div.innerHTML = document.getElementById('cart-empty-template').innerHTML;
        } else {
            tableService.populateCartProductRows(tbody, cart);
        }

        
    }

    #buildCartSummaryTable(div, tableService, cartRepository) {
        const cart = cartRepository.getCart();

        if (cart.isEmpty) {
            div.innerHTML = '';
        } else {
            tableService.populateCartSummaryTable(div, cart);
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
        this.tableService.updateCartProductRows(tbody, cart)

        const div = document.getElementById('cart-summary-table')
        this.tableService.updateCartSummaryTable(div, cart)
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
        this.tableService.updateCartProductRows(tbody, cart)

        const div = document.getElementById('cart-summary-table')
        this.tableService.updateCartSummaryTable(div, cart)
        }
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
        this.tableService.updateCartProductRows(tbody, cart)

        const div = document.getElementById('cart-summary-table')
        this.tableService.updateCartSummaryTable(div, cart)
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