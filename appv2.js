class Customer {
    constructor(id, name, email, phone, address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}
function init() {
    page = {
        elements: {
            inputName: $("#inputName"),
            inputEmail: $("#inputEmail"),
            inputPhone: $("#inputPhone"),
            inputAddress: $("#inputAddress"),
            editName: $("#editName"),
            editEmail: $("#editEmail"),
            editPhone: $("#editPhone"),
            editAddress: $("#editAddress"),
            tbBody: $("#tbody"),
            tQueue: $(".queue"),
            saveCustomerBtn: $("#saveCustomerBtn"),
            deleteCustomerBtn: $("#deleteCustomerBtn"),
            deletedCustomerName: $("#delCusName"),
            deletedCustomerEmail: $("#delCusEmail"),
            deletedCustomerPhone: $("#delCusPhone"),
            deletedCustomerAddress: $("#delCusAddress"),
            createFormSubmitBtn: $("#fSubmit"),
        },

        database: {
            customers: [],
        },

        model: {
            customer: new Customer(),
            currentCustomer: new Customer(),
        },

        commands: {
            generateId: function () {
                return "id" + Math.random().toString(16).slice(2);
            },
            createNewCustomer: function (e) {
                e.preventDefault();
                let id = page.commands.generateId();
                let fullName = page.elements.inputName.val();
                let email = page.elements.inputEmail.val();
                let phone = page.elements.inputPhone.val();
                let address = page.elements.inputAddress.val();
                let customer = new Customer(
                    id,
                    fullName,
                    email,
                    phone,
                    address,
                );
                page.commands.pushCustomerToDb(customer);
                page.commands.appendToTable(customer);
                page.commands.addQueue();
                page.commands.resetCreateForm();
            },
            pushCustomerToDb: (customer) => {
                page.database.customers.unshift(customer);
            },
            appendToTable: function (customer) {
                let tr = this.createTableRow(customer);
                $("#tbody").prepend(tr);
            },
            createTableRow: function (customer) {
                return `
                       <tr class="c${customer.id}">
                           <td class="queue"></td>
                           <td>${customer.name}</td>
                           <td>${customer.email}</td>
                           <td>${customer.phone}</td>
                           <td>${customer.address}</td>
                           <td class = "text-center">
                               <button 
                                   class="btn btn-sm btn-outline-warning mx-1"
                                   type="button"
                                   class="btn btn-primary"
                                   data-bs-toggle="modal"
                                   data-bs-target="#editCustomerModal"
                                   data-customerID=${customer.id}
                                   onclick="app.setCurrentCustomer(this.dataset.customerid)"
                                   >Edit
                               </button>
                               <button 
                                   class="btn btn-sm btn-outline-danger"
                                   data-bs-toggle="modal"
                                   data-bs-target="#deleteCustomerModal"
                                   data-customerID=${customer.id}
                                   onclick="app.setCurrentCustomer(this.dataset.customerid)"
                                   >Delete
                               </button>
                           </td>
                       </tr>
                       `;
            },
            addQueue: function () {
                page.elements.tQueue.each(function (e) {
                    this.innerText = e + 1;
                });
            },
            resetCreateForm: function () {
                page.elements.inputName.val("");
                page.elements.inputEmail.val("");
                page.elements.inputPhone.val("");
                page.elements.inputAddress.val("");
            },
            start: () => {
                page.events.clickHandler();
            },
        },

        events: {
            clickHandler: function () {
                page.elements.createFormSubmitBtn.on("click", (e) => {
                    page.commands.createNewCustomer(e);
                });

                page.elements.saveCustomerBtn.onclick = () => {};
            },
        },
    };

    page.commands.start();
}
window.onload = () => {
    init();
};
