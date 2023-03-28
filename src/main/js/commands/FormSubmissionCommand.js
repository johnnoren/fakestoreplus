export default class FormSubmissionCommand {
    constructor(form, formService, event) {
        this.form = form
        this.formService = formService
        this.event = event
    }

    execute() { 
        (formService.formInputsAreValid(form)) ? formService.saveInputs(form) : formService.stopFormSubmission(event) 
    }
}