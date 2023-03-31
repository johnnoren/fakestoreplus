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

function executeCommand(command) {
    command.execute()
}

// Not used?
function showModal(text) {
    document.querySelector('.modal-title').innerHTML = text;
    new bootstrap.Modal(document.getElementById('add-to-cart-modal')).show();
}





