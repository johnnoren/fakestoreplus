import * as commands from "./commands.js";
import * as models from "./models.js";
import * as services from "./services.js";

class Controller {
    constructor() {
        this.commands = commands;
        this.models = models;
        this.services = services;
    }

    executeCommand(command) {
        command.execute()
    }
}

const controller = new Controller();

(function init() {
    const cartRepository = new models.CartRepository();
    const cartIconService = new services.CartIconService();
    const tableService = new services.TableService();

    window.addToCart = (product) => controller.executeCommand(new commands.AddToCartCommand(product, cartRepository, cartIconService, tableService));
    window.removeFromCart = (product) => controller.executeCommand(new commands.RemoveFromCartCommand(product, cartRepository, cartIconService, tableService));
    window.deleteFromCart = (product) => controller.executeCommand(new commands.DeleteFromCartCommand(product, cartRepository, cartIconService, tableService));
    window.clearCart = () => controller.executeCommand(new commands.ClearCartCommand(commands, services, models, controller));

    controller.executeCommand(new commands.BuildPageCommand(commands, models, services, controller))
})();






