import { TableService } from "../services/index";

export default class BuildPageCommand {
    constructor(cartRepository, cartIconService) {
        this.cartRepository = cartRepository
        this.cartIconService = cartIconService
    }
    
    execute() {
        document.querySelectorAll('needs-build').forEach((div) => {
            switch (div.id) {
                case 'navbar': this.#buildNavbar(div); break;
                case 'scripts': this.#buildScripts(div); break;
                case 'footer': this.#buildFooter(div); break;
                case 'customer-details-form': this.#buildCustomerDetailsForm(div); break;
                case 'product-table': this.#buildProductTable(div); break;
                case 'products-in-cart-table': this.#buildProductsInCartTable(div); break;
                case 'customer-details': this.#buildCustomerDetailsTable(div); break;
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

    #buildProductTable(div) {
        new TableService().populateProductTable(JSON.parse(localStorage.getItem('products')), div);
    }

    #buildProductsInCartTable(div) {
        new TableService().populateProductTable(JSON.parse(localStorage.getItem('products-in-cart')), div, false);
    }

    #buildCustomerDetailsTable(div) {
        new TableService().populateCustomerDetailsTable(JSON.parse(localStorage.getItem('customer-details')), div);
    }

}