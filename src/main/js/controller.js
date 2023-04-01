import { BuildPageCommand, FormSubmissionCommand, FormInputChangeCommand } from "./commands.js";
import { CartRepository, CartIconService } from "./models.js";
import { FormService, TableService } from "./services.js";

(function init() {
    const cartRepository = new CartRepository()
    const cartIconService = new CartIconService()
    const tableService = new TableService()
    const buildPageCommand = new BuildPageCommand(cartRepository, cartIconService, tableService)
    
    new Controller().executeCommand(buildPageCommand)
})();



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



// Not used?
function showModal(text) {
    document.querySelector('.modal-title').innerHTML = text;
    new bootstrap.Modal(document.getElementById('add-to-cart-modal')).show();
}


class Controller {
    executeCommand(command) {
        command.execute()
    }
}


