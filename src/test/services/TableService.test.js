import {TableService} from '../../main/js/services/index.js';

describe('populateCustomerDetailsTable', () => {
    test('populates customer details table correctly', () => {
        // Create a mock row element with the necessary structure
        var rowTemplate = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        rowTemplate.appendChild(cell1);
        rowTemplate.appendChild(cell2);

        const customerDetails = { name: 'John Doe' };
        const customerDetailsDiv = {
            firstElementChild: {
                appendChild: jest.fn((modifiedTemplate) => rowTemplate = modifiedTemplate)
            },
            querySelector: jest.fn().mockReturnValue(rowTemplate) // mock the querySelector() function to return a valid row element
        };

        const tableService = new TableService();
        tableService.populateCustomerDetailsTable(customerDetails, customerDetailsDiv);

        expect(customerDetailsDiv.firstElementChild.appendChild).toHaveBeenCalledTimes(1);
        expect(customerDetailsDiv.querySelector).toHaveBeenCalledWith('tr');

        // Check that the cells were populated correctly
        expect(rowTemplate.cells[0].textContent).toEqual('Name:');
        expect(rowTemplate.cells[1].textContent).toEqual('John Doe');
        expect(rowTemplate.classList).not.toContain('d-none');
    });
});
