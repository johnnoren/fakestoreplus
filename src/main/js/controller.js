import * as commands from "./commands.js";
import * as models from "./models.js";
import * as services from "./services.js";

class Controller {
    executeCommand(command) {
        command.execute()
    }
}

const controller = new Controller();

(function init() {
    const cartRepository = new models.CartRepository();
    const cartIconService = new services.CartIconService(document);
    window.addToCart = (product) => controller.executeCommand(new commands.AddToCartCommand(product, cartRepository, cartIconService));
    
    controller.executeCommand(new commands.BuildPageCommand(commands, models, services, controller))
})();






