export default class TableService {
    populateCustomerDetailsTable(customerDetails, customerDetailsDiv) {
        const rowTemplate = customerDetailsDiv.querySelector('tr');

        Object.entries(customerDetails).forEach(([key, value]) => {
            const row = rowTemplate.cloneNode(true);
            
            row.cells[0].textContent = key.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) + ':'; // Capitalize first letter and replace dashes with spaces
            row.cells[1].textContent = value;
            row.classList.remove('d-none');
            
            customerDetailsDiv.firstElementChild.appendChild(row);
        });
    }
}