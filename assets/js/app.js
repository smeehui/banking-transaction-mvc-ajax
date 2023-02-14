function init() {
    const page = {
        urls: {
            getAllCustomers: AppBase.DOMAIN_API + "/customers?deleted=0",
            findCustomerById: AppBase.DOMAIN_API + "/customers",
            createCustomer: AppBase.DOMAIN_API + "/customers",
            updateCustomerById: AppBase.DOMAIN_API + "/customers",
            deleteCustomerById: AppBase.DOMAIN_API + "/customers",
        },
        elements: {},
        loadData: {},
        commands: {},
    };

    let currentCustomer;

    page.elements.allFormsInModal = $(".modal form");
    page.elements.createCustomerForm = $("#newCustomerForm");
    page.elements.editCustomerForm = $("#editCustomerForm");

    page.elements.customerTbBody = $("#tbody");

    page.elements.customerFullNameCre = $("#inputName");
    page.elements.customerEmailCre = $("#inputEmail");
    page.elements.customerPhoneCre = $("#inputPhone");
    page.elements.customerAddressCre = $("#inputAddress");

    page.elements.customerFullNameEdit = $("#editName");
    page.elements.customerEmailEdit = $("#editEmail");
    page.elements.customerPhoneEdit = $("#editPhone");
    page.elements.customerAddressEdit = $("#editAddress");

    page.elements.showCreateCustomerBtn = $("#showCreateCustomerBtn");
    page.elements.createCusSubBtn = $("#createCusSubBtn");
    page.elements.editConfirmCustomerBtn = $("#editConfirmCustomerBtn");

    page.elements.newCustomerCollapse = $("#newCustomerCollapse");

    page.elements.allModalsHavingForm = $(".modal:has(form)");
    page.elements.editCustomerModal = $("#editCustomerModal");
    page.elements.depositModal = $("#depositModal");
    page.elements.deleteCustomerModal = $("#deleteCustomerModal");

    page.commands.modalEventHandler = () => {
        // page.elements.depositModal.on("hidden.bs.modal", () => {
        //     page.elements.depositModal[0].reset();
        //     page.elements.depositModal[0].validate().resetForm();
        // });
        page.elements.allModalsHavingForm.on("hidden.bs.modal", () => {
            page.elements.allFormsInModal.each((i, el) => {
                el.reset();
                $(el).validate().resetForm();
            });
        });
    };
    page.commands.collapseEventHandler = () => {
        page.elements.showCreateCustomerBtn.on("click", () => {
            page.elements.newCustomerCollapse.collapse("toggle");
        });
    };

    page.commands.mainBtnClickEventHandler = () => {
        page.elements.createCusSubBtn.on("click", () => {
            page.elements.createCustomerForm.trigger("submit");
        });
        page.elements.editConfirmCustomerBtn.on("click", () => {
            page.elements.editCustomerForm.trigger("submit");
        });
    };

    page.commands.resetCreateCustomerForm = () => {
        page.elements.createCustomerForm[0].reset();
    };
    page.commands.removeActionBtnsClickEvents = () => {
        page.elements.actionButtonEdits.off("click");
        page.elements.actionButtonDeletes.off("click");
        page.elements.actionButtonDeposits.off("click");
    };
    page.commands.addActionBtnsClickEvent = () => {
        page.elements.actionButtonEdits = $(".btn-edit");
        page.elements.actionButtonDeletes = $(".btn-delete");
        page.elements.actionButtonDeposits = $(".btn-deposit");
        page.elements.actionButtonEdits.on("click", function () {
            page.elements.editCustomerModal.modal("toggle");
            page.commands.editCustomerHandler($(this).data("customerid"));
        });

        page.elements.actionButtonDeletes.on("click", function () {
            page.commands.deleteCustomerHandler($(this).data("customerid"));
        });
        page.elements.actionButtonDeposits.on("click", function () {
            page.elements.editCustomerModal.modal("toggle");
        });
    };
    page.loadData.findAllCustomer = () => {
        $.ajax({
            type: "GET",
            url: page.urls.getAllCustomers,
        }).done((data) => {
            page.commands.drawCustomerTableBody(data);
        });
    };

    page.commands.findCustomerById = (id) => {
        return $.ajax({
            type: "GET",
            url: page.urls.findCustomerById + `/${id}`,
        }).fail(() => {
            AppBase.SweetAlert.showErrorAlert("Customer not found");
        });
    };

    page.commands.createTableRow = (customer) => {
        return `
                <tr class="tr_${customer.id}">
                    <td class="queue">${customer.id}</td>
                    <td>${customer.fullName}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td class = "text-center">
                        <button 
                            class="btn btn-edit btn-sm btn-outline-warning mx-1"
                            type="button"
                            class="btn btn-primary"
                            data-customerID=${customer.id}
                            >Edit
                        </button>
                        <button 
                            class="btn btn-deposit btn-sm btn-outline-success mx-1"
                            type="button"
                            class="btn btn-primary"
                            data-customerID=${customer.id}
                            >Deposit
                        </button>
                        <button 
                            class="btn btn-delete btn-sm btn-outline-danger"
                            data-customerID=${customer.id}
                            >Delete
                        </button>
                    </td>
                </tr>
                `;
    };

    page.commands.drawCustomerTableBody = (data) => {
        $.each(data, (i, item) => {
            let rowStr = page.commands.createTableRow(item);
            page.elements.customerTbBody.prepend(rowStr);
        });
        page.commands.addActionBtnsClickEvent();
    };

    page.commands.appendToCustomerTable = (customer) => {
        let tr = page.commands.createTableRow(customer);
        page.elements.customerTbBody.prepend(tr);
    };

    page.commands.createNewCustomer = () => {
        let fullName = page.elements.customerFullNameCre.val();
        let email = page.elements.customerEmailCre.val();
        let phone = page.elements.customerAddressCre.val();
        let address = page.elements.customerPhoneCre.val();
        let customer = new Customer(fullName, email, phone, address);
        $.ajax({
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            type: "POST",
            url: page.urls.createCustomer,
            data: JSON.stringify(customer),
        })
            .done((data) => {
                customer = data;
                page.commands.appendToCustomerTable(customer);

                AppBase.SweetAlert.showSuccessAlert(
                    "New customer is created successfully!",
                );

                page.commands.removeActionBtnsClickEvents();
                page.commands.addActionBtnsClickEvent();
                page.commands.resetCreateCustomerForm();
            })
            .fail(() => {
                AppBase.SweetAlert.showErrorAlert(
                    "Some thing went wrong, please contact administrator!",
                );
            });
    };

    page.commands.editCustomerHandler = (id) => {
        page.commands.findCustomerById(id).then((data) => {
            currentCustomer = data;
            page.commands.appendCurrentCustomerInfoToEditForm(data);
        });
    };
    page.commands.appendCurrentCustomerInfoToEditForm = (customer) => {
        page.elements.customerFullNameEdit.val(customer.fullName);
        page.elements.customerEmailEdit.val(customer.email);
        page.elements.customerPhoneEdit.val(customer.phone);
        page.elements.customerAddressEdit.val(customer.address);
    };
    page.commands.updateCustomerById = () => {
        let id = currentCustomer.id;
        let fullName = page.elements.customerFullNameEdit.val();
        let email = page.elements.customerEmailEdit.val();
        let phone = page.elements.customerPhoneEdit.val();
        let address = page.elements.customerAddressEdit.val();

        currentCustomer.fullName = fullName;
        currentCustomer.email = email;
        currentCustomer.phone = phone;
        currentCustomer.address = address;

        page.commands
            .findCustomerById(id)
            .then(() => {
                $.ajax({
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                    },
                    type: "PATCH",
                    url: page.urls.updateCustomerById + `/${id}`,
                    data: JSON.stringify(currentCustomer),
                }).done((data) => {
                    AppBase.SweetAlert.showSuccessAlert(
                        "Customer is updated successfully",
                    );
                    let tr = $(`.tr_${id}`);
                    tr.replaceWith(page.commands.createTableRow(data));
                    page.commands.removeActionBtnsClickEvents();
                    page.commands.addActionBtnsClickEvent();
                });
            })
            .catch(() => {
                AppBase.SweetAlert.showErrorAlert("Customer not found!");
            });
    };

    page.commands.deleteCustomerHandler = (id) => {
        page.commands.findCustomerById(id).then(() => {
            AppBase.SweetAlert.showDeleteConfirmDialog().then((result) => {
                if (result.isConfirmed) {
                    page.commands.deleteCustomerById(id);
                }
            });
        });
    };

    page.commands.deleteCustomerById = (id) => {
        $.ajax({
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            type: "PATCH",
            url: page.urls.deleteCustomerById + `/${id}`,
            data: JSON.stringify({ deleted: 1 }),
        })
            .done(() => {
                $(`.tr_${id}`).remove();
                AppBase.SweetAlert.showSuccessAlert(
                    "Customer is deleted successfully!",
                );
            })
            .fail(() => {
                AppBase.SweetAlert.showErrorAlert(
                    "Some thing went wrong, please try again later!",
                );
            });
    };

    page.commands.validationHandler = () => {
        let customerValidationRules = {
            email: {
                required: true,
                email: true,
            },
            fullName: {
                required: true,
                minlength: 5,
                maxlength: 40,
            },
            phone: {
                required: true,
            },
            address: {
                required: true,
                minlength: 5,
            },
        };
        let customerValidationMessages = {
            fullName: {
                required: "Full name is required",
                minlength: "Min character of full name is ${0}",
                maxlength: "Max character of full name is ${0}",
            },
            email: {
                required: "Email is required",
                email: "Email is not valid",
            },
            phone: {
                required: "Phone is required",
            },
            address: {
                required: "Address is require",
                minlength: "Min character of address is ${0}",
            },
        };

        $.validator.methods.email = function (value, element) {
            return (
                this.optional(element) || /[a-z]+@[a-z]+\.[a-z]{2,}/.test(value)
            );
        };
        $.validator.setDefaults({ errorElement: "li" });

        page.elements.createCustomerForm.validate({
            rules: customerValidationRules,

            messages: customerValidationMessages,

            errorLabelContainer: "#newCustomerCollapse .alert-danger",
            errorPlacement: function (error, element) {
                console.log(element);
                error.appendTo("#newCustomerCollapse .alert-danger");
            },
            showErrors: function (errorMap, errorList) {
                if (this.numberOfInvalids() > 0) {
                    $("#newCustomerCollapse .alert-danger")
                        .removeClass("d-none")
                        .addClass("show");
                } else {
                    $("#newCustomerCollapse .alert-danger")
                        .removeClass("show")
                        .addClass("d-none")
                        .empty();
                }
                this.defaultShowErrors();
            },
            submitHandler: function () {
                page.commands.createNewCustomer();
            },
        });
        page.elements.editCustomerForm.validate({
            rules: customerValidationRules,

            messages: customerValidationMessages,

            errorLabelContainer: "#editCustomerModal .alert-danger",
            errorPlacement: function (error, element) {
                console.log(element);
                error.appendTo("#editCustomerModal .alert-danger");
            },
            showErrors: function (errorMap, errorList) {
                if (this.numberOfInvalids() > 0) {
                    $("#editCustomerModal .alert-danger")
                        .removeClass("d-none")
                        .addClass("show");
                } else {
                    $("#editCustomerModal .alert-danger")
                        .removeClass("show")
                        .addClass("d-none")
                        .empty();
                }
                this.defaultShowErrors();
            },
            submitHandler: function () {
                page.elements.editCustomerModal.modal("toggle");
                page.commands.updateCustomerById();
            },
        });
    };

    return () => {
        page.loadData.findAllCustomer();

        page.commands.modalEventHandler();

        page.commands.collapseEventHandler();

        page.commands.mainBtnClickEventHandler();

        page.commands.validationHandler();
    };

    // return (app = {
    //     customers: [],

    //     currentCustomer: null,

    //     generateId: function () {
    //         return "id" + Math.random().toString(16).slice(2);
    //     },
    //     createNewCustomer: function () {
    //         let _this = app;
    //         let id = _this.generateId();
    //         let fullName = $("#inputName").val();
    //         let email = $("#inputEmail").val();
    //         let phone = $("#inputPhone").val();
    //         let address = $("#inputAddress").val();
    //         let customer = new Customer(id, fullName, email, phone, address);

    //         _this.customers.unshift(customer);
    //         _this.appendToCustomerTable(customer);
    //         _this.addQueue();

    //         _this.eventHandler.removeActionBtnsClickEvents();
    //         _this.eventHandler.addActionBtnsClickEvent();
    //         _this.resetCreateCustomerForm();
    //     },

    //     resetCreateCustomerForm: function () {
    //         $("#inputName").val("");
    //         $("#inputEmail").val("");
    //         $("#inputPhone").val("");
    //         $("#inputAddress").val("");
    //     },

    // appendCurrentCustomerInfoToEditForm: function () {
    //     let customer = this.currentCustomer;
    //     $("#editName").val(customer.name);
    //     $("#editEmail").val(customer.email);
    //     $("#editPhone").val(customer.phone);
    //     $("#editAddress").val(customer.address);
    // },

    //     setCurrentCustomer: function (id) {
    //         this.currentCustomer = this.customers.filter((c) => c.id == id)[0];
    //         console.log(this.currentCustomer);
    //     },

    //     updateCustomer: function () {
    //         let _this = app;

    //         let customer = _this.currentCustomer;
    //         let id = customer.id;
    // let fullName = $("#editName").val();
    // let email = $("#editEmail").val();
    // let phone = $("#editPhone").val();
    // let address = $("#editAddress").val();

    // if (fullName.length > 0) customer.name = fullName;
    // if (email.length > 0) customer.email = email;
    // if (phone.length > 0) customer.phone = phone;
    // if (address.length > 0) customer.address = address;

    // _this.updateCustomerInDbBy(customer);

    // let tr = $(`.c${id}`);
    // tr.replaceWith(page.commands.createTableRow(customer));

    // _this.eventHandler.removeActionBtnsClickEvents();
    // _this.eventHandler.addActionBtnsClickEvent();
    // _this.addQueue();
    //     },
    //     updateCustomerInDbBy: (customer) => {
    //         let _this = app;
    //         _this.customers.forEach((c, i) => {
    //             if (c.id == customer.id) _this.customers[i] = customer;
    //         });
    //     },
    //     appendCurrentCustomerInfoToDeleteModal: function () {
    //         let customer = this.currentCustomer;
    //         $("#delCusName").text(customer.name);
    //         $("#delCusEmail").text(customer.email);
    //         $("#delCusPhone").text(customer.phone);
    //         $("#delCusAddress").text(customer.address);
    //     },
    //     appendCurrentCustomerInfoToDepositModal: function () {
    //         $("#depositCusName").val(app.currentCustomer.name);
    //     },
    //     deleteCustomer: function () {
    //         let id = app.currentCustomer.id;
    //         app.customers = app.customers.filter((c) => c.id != id);

    //         $(`.c${id}`).remove();
    //         app.addQueue();
    //     },

    //     editCustomerHandler: function () {
    //         this.createSaveBtnLister();
    //     },
    //     eventHandler: {
    //         crudButtons: function () {
    //             let _this = app;

    //             $("#fSubmit").on("click", () => {
    //                 $("#newCustomerForm").trigger("submit");
    //             });

    //             $("#updateCustomerBtn").on("click", () => {
    //                 $("#editCustomerForm").trigger("submit");
    //             });

    //             $("#deleteCustomerBtn").on("click", _this.deleteCustomer);

    //             $("#showCreateCustomerBtn").on("click", () => {
    //                 $("#newCustomerCollapse").collapse("toggle");
    //             });
    //         },
    //         addActionBtnsClickEvent: function () {
    //             let _this = app;
    //             $(".btn-edit").on("click", function () {
    //                 _this.setCurrentCustomer(this.dataset.customerid);
    //                 _this.appendCurrentCustomerInfoToEditForm();
    //             });

    //             $(".btn-delete").on("click", function () {
    //                 _this.setCurrentCustomer(this.dataset.customerid);
    //                 _this.appendCurrentCustomerInfoToDeleteModal();
    //             });
    //             $(".btn-deposit").on("click", function () {
    //                 $("#depositModal").modal("toggle");
    //                 _this.setCurrentCustomer(this.dataset.customerid);
    //                 _this.appendCurrentCustomerInfoToDepositModal();
    //             });

    //             $("#editCustomerModal").on("hidden.bs.modal", () => {
    //                 $("#editCustomerModal")[0].reset();
    //                 $("#editCustomerModal")[0].validate().resetForm();
    //             });
    //         },
    //         removeActionBtnsClickEvents: () => {
    //             let _this = app;
    //             $(".btn-edit").off("click");
    //             $(".btn-delete").off("click");
    //             $(".btn-deposit").off("click");
    //         },
    //     },

    //     validationHandler: function () {
    //         let _this = app;
    //         let customerValidationRules = {
    //             email: {
    //                 required: true,
    //                 email: true,
    //             },
    //             fullName: {
    //                 required: true,
    //                 minlength: 5,
    //                 maxlength: 40,
    //             },
    //             phone: {
    //                 required: true,
    //             },
    //             address: {
    //                 required: true,
    //                 minlength: 5,
    //             },
    //         };
    //         let customerValidationMessages = {
    //             fullName: {
    //                 required: "Full name is required",
    //                 minlength: "Min character of full name is ${0}",
    //                 maxlength: "Max character of full name is ${0}",
    //             },
    //             email: {
    //                 required: "Email is required",
    //                 email: "Email is not valid",
    //             },
    //             phone: {
    //                 required: "Phone is required",
    //             },
    //             address: {
    //                 required: "Address is require",
    //                 minlength: "Min character of address is ${0}",
    //             },
    //         };

    //         $.validator.methods.email = function (value, element) {
    //             return (
    //                 this.optional(element) ||
    //                 /[a-z]+@[a-z]+\.[a-z]+/.test(value)
    //             );
    //         };
    //         $.validator.setDefaults({ errorElement: "li" });

    //         $("#newCustomerForm").validate({
    //             rules: customerValidationRules,

    //             messages: customerValidationMessages,

    //             errorLabelContainer: "#newCustomerCollapse .alert-danger",
    //             errorPlacement: function (error, element) {
    //                 console.log(element);
    //                 error.appendTo("#newCustomerCollapse .alert-danger");
    //             },
    //             showErrors: function (errorMap, errorList) {
    //                 if (this.numberOfInvalids() > 0) {
    //                     $("#newCustomerCollapse .alert-danger")
    //                         .removeClass("d-none")
    //                         .addClass("show");
    //                 } else {
    //                     $("#newCustomerCollapse .alert-danger")
    //                         .removeClass("show")
    //                         .addClass("d-none")
    //                         .empty();
    //                 }
    //                 this.defaultShowErrors();
    //             },
    //             submitHandler: function () {
    //                 _this.createNewCustomer();
    //             },
    //         });
    //         $("#editCustomerForm").validate({
    //             rules: customerValidationRules,

    //             messages: customerValidationMessages,

    //             errorLabelContainer: "#editCustomerModal .alert-danger",
    //             errorPlacement: function (error, element) {
    //                 console.log(element);
    //                 error.appendTo("#editCustomerModal .alert-danger");
    //             },
    //             showErrors: function (errorMap, errorList) {
    //                 if (this.numberOfInvalids() > 0) {
    //                     $("#editCustomerModal .alert-danger")
    //                         .removeClass("d-none")
    //                         .addClass("show");
    //                 } else {
    //                     $("#editCustomerModal .alert-danger")
    //                         .removeClass("show")
    //                         .addClass("d-none")
    //                         .empty();
    //                 }
    //                 this.defaultShowErrors();
    //             },
    //             submitHandler: function () {
    //                 _this.updateCustomer();
    //                 $("#editCustomerModal").modal("toggle");
    //             },
    //         });
    //     },
    //     start: function () {
    //         this.eventHandler.crudButtons();
    //         this.validationHandler();
    //     },
    // });
}
window.onload = () => {
    let App = init();
    App();
};
