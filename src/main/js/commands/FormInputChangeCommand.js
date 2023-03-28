export default class FormInputChangeCommand {
    constructor(input, formService) {
        this.input = input
        this.formService = formService
    }

    execute() {
        formService.validateInput(input)
    }
}