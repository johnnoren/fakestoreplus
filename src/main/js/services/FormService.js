export default class FormService {

    formInputsAreValid(form) {
        form.classList.add('was-validated');
        return form.checkValidity();
    }

    stopFormSubmission(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    validateInputChange(input) {
        input.classList.toggle('is-valid', input.checkValidity());
        input.classList.toggle('is-invalid', !input.checkValidity());
    }

    saveInputs(form) {
        const formValues = Object.fromEntries(new FormData(form).entries());
        localStorage.setItem(form.id, JSON.stringify(formValues));
    }

}