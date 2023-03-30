export default class BuildPageCommand {
    constructor(cartRepository, cartIconService) {
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
    }
    
    execute() {
        document.querySelectorAll('needs-build').forEach((div) => {
            switch (div.id) {
                case 'navbar': this.#buildNavbar(div);
                case 'scripts': this.#buildScripts(div);
                case 'footer': this.#buildFooter(div);
                case 'customer-details-form': this.#buildCustomerDetailsForm(div);
                //case 'product-table': getProductsFromAPI().then((products) => populateProductTable(products, div)); break;
                //case 'products-in-cart-table': populateProductTable([JSON.parse(localStorage.getItem('product'))], div, false); break;
                //case 'customer-details': populateCustomerDetailsTable(JSON.parse(localStorage.getItem('customer-details')), div); break;
            }
        })
    }

    #getHtmlFromFile(url) {
        fetch(url).then((response) => response.text()).then((html) => html);
    }

    #buildNavbar(div) {
        div.innerHTML = this.#getHtmlFromFile('navbar.html');
        new CartIconService().setCartIconBadgeCount(new CartRepository().getCart().getQuantityOfItems())
    }

    #buildScripts(div) {
        div.innerHTML = this.#getHtmlFromFile('scripts.html');
    }

    #buildFooter(div) {
        div.innerHTML = this.#getHtmlFromFile('footer.html');
    }

    #buildCustomerDetailsForm(div) {
        div.innerHTML = this.#getHtmlFromFile('customer-details-form.html');
    }

}