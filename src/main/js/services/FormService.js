export default class FormService {

    validateForm(form) {
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
        const rawFormInputs = Array.from(form.querySelectorAll('.form-input'));
        const formInputs = Object.fromEntries(formInputs.map((input) => [input.id, input.value]))
        localStorage.setItem(form.id, JSON.stringify(formInputs));
    }

}