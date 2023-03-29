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
            }
        })
    }

    #getHtmlFromFile = (url) => fetch(url).then((response) => response.text()).then((html) => html);

    #buildNavbar(div) {
        div.innerHTML = getHtmlFromFile('navbar.html');
        new CartIconService().setCartIconBadgeCount(new CartRepository().getCart().getQuantityOfItems())
    }

    #buildScripts(div) {
        div.innerHTML = getHtmlFromFile('scripts.html');
    }

    #buildFooter(div) {
        div.innerHTML = getHtmlFromFile('footer.html');
    }

    #buildCustomerDetailsForm(div) {
        div.innerHTML = getHtmlFromFile('customer-details-form.html');
    }

}