class Customer {
    constructor(id, name, email, phone, address, balance = 0) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.balance = balance;
    }
}

function init() {
    return (app = {
        customers: [],

        currentCustomer: null,

        generateId: function () {
            return "id" + Math.random().toString(16).slice(2);
        },
        removeClickEvents: () => {
            let _this = app;
            $(".btn-edit").off("click");
            $(".btn-delete").off("click");
        },
        addBtnsClickEvents: function () {
            let _this = app;
            $(".btn-edit").on("click", function () {
                _this.setCurrentCustomer(this.dataset.customerid);
                _this.appendCurrentCustomerInfoToEditForm();
            });

            $(".btn-delete").on("click", function () {
                _this.setCurrentCustomer(this.dataset.customerid);
                _this.appendCurrentCustomerInfoToDeleteModal();
            });
        },
        createNewCustomer: function () {
            let _this = app;
            let id = _this.generateId();
            let fullName = $("#inputName").val();
            let email = $("#inputEmail").val();
            let phone = $("#inputPhone").val();
            let address = $("#inputAddress").val();
            let customer = new Customer(id, fullName, email, phone, address);

            _this.customers.unshift(customer);
            _this.appendToTable(customer);
            _this.addQueue();

            _this.removeClickEvents();
            _this.addBtnsClickEvents();
            _this.resetCreateForm();
        },

        resetCreateForm: function () {
            $("#inputName").val("");
            $("#inputEmail").val("");
            $("#inputPhone").val("");
            $("#inputAddress").val("");
        },

        appendToTable: function (customer) {
            let tr = this.createTableRow(customer);
            $("#tbody").prepend(tr);
        },

        addQueue: function () {
            $(".queue").each(function (e) {
                this.innerText = e + 1;
            });
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
                                class="btn btn-edit btn-sm btn-outline-warning mx-1"
                                type="button"
                                class="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#editCustomerModal"
                                data-customerID=${customer.id}
                                >Edit
                            </button>
                            <button 
                                class="btn btn-delete btn-sm btn-outline-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteCustomerModal"
                                data-customerID=${customer.id}
                                >Delete
                            </button>
                        </td>
                    </tr>
                    `;
        },

        appendCurrentCustomerInfoToEditForm: function () {
            let customer = this.currentCustomer;
            $("#editName").val(customer.name);
            $("#editEmail").val(customer.email);
            $("#editPhone").val(customer.phone);
            $("#editAddress").val(customer.address);
        },

        setCurrentCustomer: function (id) {
            this.currentCustomer = this.customers.filter((c) => c.id == id)[0];
            console.log(this.currentCustomer);
        },

        saveCustomer: function () {
            let _this = app;

            let customer = _this.currentCustomer;
            let id = customer.id;
            let fullName = $("#editName").val();
            let email = $("#editEmail").val();
            let phone = $("#editPhone").val();
            let address = $("#editAddress").val();

            if (fullName.length > 0) customer.name = fullName;
            if (email.length > 0) customer.email = email;
            if (phone.length > 0) customer.phone = phone;
            if (address.length > 0) customer.address = address;

            _this.updateCustomerInDbBy(customer);

            let tr = $(`.c${id}`);
            tr.replaceWith(_this.createTableRow(customer));

            _this.addQueue();
        },
        updateCustomerInDbBy: (customer) => {
            let _this = app;
            _this.customers.forEach((c, i) => {
                if (c.id == customer.id) _this.customers[i] = customer;
            });
        },
        appendCurrentCustomerInfoToDeleteModal: function () {
            let customer = this.currentCustomer;
            $("#delCusName").text(customer.name);
            $("#delCusEmail").text(customer.email);
            $("#delCusPhone").text(customer.phone);
            $("#delCusAddress").text(customer.address);
        },

        deleteCustomer: function () {
            let id = app.currentCustomer.id;
            app.customers = app.customers.filter((c) => c.id != id);

            $(`.c${id}`).remove();
            app.addQueue();
        },

        editCustomerHandler: function () {
            this.createSaveBtnLister();
        },
        eventHandler: function () {
            let _this = this;

            $("#fSubmit").on("click", () => {
                $("#newCustomerForm").trigger("submit");
            });

            $("#saveCustomerBtn").on("click", _this.saveCustomer);

            $("#deleteCustomerBtn").on("click", _this.deleteCustomer);

            $("#showCreateCustomerBtn").on("click", () => {
                $("#newCustomerCollapse").collapse("toggle");
            });
        },

        validationHandler: function () {
            let _this = app;

            $.validator.methods.email = function (value, element) {
                return (
                    this.optional(element) ||
                    /[a-z]+@[a-z]+\.[a-z]+/.test(value)
                );
            };

            $("#newCustomerForm").validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    fullName: {
                        required: true,
                        minlength: 5,
                        maxlength: 40,
                    },
                },

                messages: {
                    fullName: {
                        required: "Full name is required",
                        minlength: "Min character of full name is ${0}",
                        maxlength: "Max character of full name is ${0}",
                    },
                    email: {
                        required: "Email is required",
                        email: "Email is not valid",
                    },
                },
                errorLabelContainer: ".container .alert-danger",
                errorPlacement: function (error, element) {
                    console.log(element);
                    error.appendTo(".container .alert-danger");
                },
                showErrors: function (errorMap, errorList) {
                    if (this.numberOfInvalids() > 0) {
                        $(".container .alert-danger")
                            .removeClass("d-none")
                            .addClass("show py-1");
                    } else {
                        $(".container .alert-danger")
                            .removeClass("show")
                            .addClass("d-none")
                            .empty();
                    }
                    this.defaultShowErrors();
                },
                submitHandler: function () {
                    _this.createNewCustomer();
                },
            });
        },
        start: function () {
            this.eventHandler();
            this.validationHandler();
        },
    });
}
window.onload = () => {
    let App = init();
    App.start();
};
