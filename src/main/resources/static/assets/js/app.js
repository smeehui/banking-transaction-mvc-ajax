function init() {
    const page = {
        urls: {
            getAllCustomers: AppBase.DOMAIN_MVC_API + "/customers",
            getAllCustomerNot:
                AppBase.DOMAIN_MVC_API + "/customers/id_ne=",
            getAllDeposits: AppBase.DOMAIN_MVC_API + "/deposits",
            getAllTransfers: AppBase.DOMAIN_MVC_API + "/transfers",
            findCustomerById: AppBase.DOMAIN_MVC_API + "/customers",
            createCustomer: AppBase.DOMAIN_MVC_API + "/customers",
            updateCustomerById: AppBase.DOMAIN_MVC_API + "/customers",
            deleteCustomerById: AppBase.DOMAIN_MVC_API + "/customers",
            createNewDeposit: AppBase.DOMAIN_MVC_API + "/deposits",
            createNewTransfer: AppBase.DOMAIN_MVC_API + "/transfers",
        },
        elements: {},
        loadData: {},
        commands: {},
    };
    let currentRow = $();
    let currentCustomer = new Customer();
    let locationRegion = new LocationRegion();


    page.commands.decodeCookie = () => {
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        token = "Bearer " + ca[0].replace("jwtToken=", "")

    }


    page.elements.allFormsInModal = $(".modal form");
    page.elements.createCustomerForm = $("#newCustomerForm");
    page.elements.editCustomerForm = $("#editCustomerForm");
    page.elements.depositForm = $("#depositForm");
    page.elements.transferForm = $("#transferForm");

    page.elements.customerTbBody = $("#tbody");
    page.elements.transferHistoryTbBody = $("#transferHistoryTbBody");
    page.elements.depositHistoryTbBody = $("#depositHistoryTbBody");

    page.elements.customerFullNameCre = $("#inputName");
    page.elements.customerEmailCre = $("#inputEmail");
    page.elements.customerPhoneCre = $("#inputPhone");
    page.elements.customerAddressCre = $("#inputAddress");
    page.elements.inputProvince = $(".inputProvince");
    page.elements.inputDistrict = $(".inputDistrict");
    page.elements.inputWard = $(".inputWard")
    page.elements.customerCreErrorUl = $("#newCustomerModal .alert-danger")

    page.elements.customerFullNameEdit = $("#editName");
    page.elements.customerEmailEdit = $("#editEmail");
    page.elements.customerPhoneEdit = $("#editPhone");
    page.elements.customerAddressEdit = $("#editAddress");

    page.elements.depositCusName = $("#depositCusName");
    page.elements.depositCusEmail = $("#depositCusEmail");
    page.elements.depositCusBalance = $("#depositCusBalance");
    page.elements.depositAmount = $("#depositAmount");

    page.elements.tfSenderCusName = $("#tfSenderCusName");
    page.elements.tfSenderCusEmail = $("#tfSenderCusEmail");
    page.elements.tfSenderCusBalance = $("#tfSenderCusBalance");
    page.elements.tfRecipientCusName = $("#tfRecipientCusName");
    page.elements.tfAmount = $("#tfAmount");
    page.elements.tfTotal = $("#tfTotal");
    page.elements.recipientSelection = $("#recipientSelection");

    page.elements.showTransferHistoryBtn = $("#showTransferHistory");
    page.elements.showDepositHistoryBtn = $("#showDepositHistory");
    page.elements.showCreateCustomerBtn = $("#showCreateCustomerBtn");
    page.elements.createCusSubBtn = $("#createCusSubBtn");
    page.elements.editConfirmCustomerBtn = $("#editConfirmCustomerBtn");
    page.elements.depositConfirmBtn = $("#depositConfirmBtn");
    page.elements.transferConfirmBtn = $("#transferConfirmBtn");

    page.elements.newCustomerModal = $("#newCustomerModal");

    page.elements.allModalsHavingForm = $(".modal:has(form)");
    page.elements.editCustomerModal = $("#editCustomerModal");
    page.elements.depositModal = $("#depositModal");
    page.elements.deleteCustomerModal = $("#deleteCustomerModal");
    page.elements.transferModal = $("#transferModal");
    page.elements.transferHistoryModal = $("#transferHistoryModal");
    page.elements.depositHistoryModal = $("#depositHistoryModal");

    page.elements.pageFooter = $(".footer");

    page.commands.modalEventHandler = () => {
        // page.elements.depositModal.on("hidden.bs.modal", () => {
        //     page.elements.depositModal[0].reset();
        //     page.elements.depositModal[0].validate().resetForm();
        // });
        page.elements.allModalsHavingForm.on("hidden.bs.modal", () => {
            page.elements.allFormsInModal.each((i, el) => {
                el.reset();
                $(".modal .alert-danger").empty().addClass("d-none").removeClass("show");
            });
        });
    };

    page.commands.mainBtnClickEventHandler = () => {
        page.elements.showCreateCustomerBtn.on("click", () => {
            page.elements.newCustomerModal.modal("toggle");
        });
        page.elements.createCusSubBtn.on("click", () => {
            page.elements.createCustomerForm.trigger("submit");
        });
        page.elements.editConfirmCustomerBtn.on("click", () => {
            page.elements.editCustomerForm.trigger("submit");
        });
        page.elements.depositConfirmBtn.on("click", () => {
            page.elements.depositForm.trigger("submit");
        });
        page.elements.transferConfirmBtn.on("click", () => {
            page.elements.transferForm.trigger("submit");
        });
        page.elements.showTransferHistoryBtn.on("click", () => {
            page.elements.transferHistoryModal.modal("toggle");
        });
        page.elements.showDepositHistoryBtn.on("click", () => {
            page.elements.depositHistoryModal.modal("toggle");
        });
    };
    page.commands.addInputListenToTransferAmount = () => {
        page.elements.tfAmount.on("input", () => {
            page.commands.calculateTotalAmount();
        });
    };
    page.commands.addInputListenerToAddressSelection = () => {
        page.elements.inputProvince.on("change", function () {
            page.loadData
                .getAllDistrictsByProvince($(this).val())
                .then((districts) => {
                    page.loadData.getAllWardsByDistrict(
                        districts.results[0].district_id,
                    );
                });
        });
        page.elements.inputDistrict.on("change", function () {
            page.loadData.getAllWardsByDistrict(
                $(this).val(),
            );
        });
    };

    page.commands.resetCreateCustomerForm = () => {
        page.elements.createCustomerForm[0].reset();
    };
    page.commands.removeActionBtnsClickEvents = () => {
        page.elements.actionButtonEdits.off("click");
        page.elements.actionButtonDeletes.off("click");
        page.elements.actionButtonDeposits.off("click");
        page.elements.actionButtonTransfers.off("click");
    };

    page.loadData.getAllProvinces = () => {
        return $.ajax({
            type: "GET",
            url: "https://vapi.vnappmob.com/api/province/",
        })
            .done((data) => {
                $.each(data.results, (i, item) => {
                    let str = `<option value="${item.province_id}">${item.province_name}</option>`;

                    page.elements.inputProvince.append(str);
                });
                page.commands.addInputListenerToAddressSelection();
            })
            .fail(() => {
                AppBase.SweetAlert.showErrorAlert("Load Provinces fail");
            });
    };


    page.loadData.ajaxAllProvinces = () => {
        return $.ajax({
            type: "GET",
            url: "https://vapi.vnappmob.com/api/province/",
        })
    }

    page.loadData.getAllDistrictsByProvince = (provinceId) => {
        return $.ajax({
            type: "GET",
            url:
                "https://vapi.vnappmob.com/api/province/district/" + provinceId,
        })
            .done((data) => {
                let str = "";
                $.each(data.results, (i, item) => {
                    str += `<option value="${item.district_id}">${item.district_name}</option>`;
                });
                page.elements.inputDistrict.empty().append(str);
            })
            .fail(() => {
                AppBase.SweetAlert.showErrorAlert("Load Districts fail");
            });
    };

    page.loadData.getAllWardsByDistrict = (districtId) => {
        $.ajax({
            type: "GET",
            url: "https://vapi.vnappmob.com/api/province/ward/" + districtId,
        })
            .done((data) => {
                let str = "";
                $.each(data.results, (i, item) => {
                    str += `<option value="${item.ward_id}">${item.ward_name}</option>`;
                });
                page.elements.inputWard.empty().append(str);
            })
            .fail((jqXHR) => {
                AppBase.SweetAlert.showErrorAlert("Load Wards fail");
            });
    };

    page.loadData.getAddressInfo = () => {
        page.loadData.getAllProvinces().then((provinces) => {
            page.loadData
                .getAllDistrictsByProvince(provinces.results[0].province_id)
                .then((districts) => {
                    page.loadData.getAllWardsByDistrict(
                        districts.results[0].district_id,
                    );
                });
        });
    };
    page.loadData.getAllDeposits = () => {
        $.ajax({
            headers: {
                Authorization: token,
            },
            type: "GET",
            url: page.urls.getAllDeposits,
        }).done((data) => {
            let rows;
            $.each(data, (i, item) => {
                rows += page.commands.createDepositRow(item, item.customer);
            });
            page.elements.depositHistoryTbBody.empty().append(rows);
        });
    };

    page.commands.addActionBtnsClickEvent = () => {
        let isActive = false;
        page.elements.actionButtonEdits = $(".btn-edit");
        page.elements.actionButtonDeletes = $(".btn-delete");
        page.elements.actionButtonDeposits = $(".btn-deposit");
        page.elements.actionButtonTransfers = $(".btn-transfer");
        page.elements.customerTableTrs = $("#customerTable tbody tr").on(
            "click",
            function () {
                page.commands.styleCurrentSelectedRow($(this), isActive);
                page.commands.setCustomerIdForActionBtn(
                    $(this).data("customerid"),
                );
                isActive = page.elements.customerTableTrs.hasClass("active");
                if (isActive) {
                    page.elements.pageFooter.show();
                } else page.elements.pageFooter.hide();
            },
        );
        page.elements.actionButtonEdits.on("click", function () {
            page.commands.editCustomerHandler($(this).data("customerid"));
        });

        page.elements.actionButtonDeletes.on("click", function () {
            page.commands.deleteCustomerHandler($(this).data("customerid"));
        });
        page.elements.actionButtonDeposits.on("click", function () {
            page.commands.appendCustomerInfoToDepositModal(
                $(this).data("customerid"),
            );
        });
        page.elements.actionButtonTransfers.on("click", function () {
            page.commands.addInputListenToTransferAmount();
            page.commands.appendCustomerInfoToTransferModal(
                $(this).data("customerid"),
            );
        });
    };

    page.commands.setCustomerIdForActionBtn = (id) => {
        page.elements.actionButtonEdits.data("customerid", id);
        page.elements.actionButtonDeletes.data("customerid", id);
        page.elements.actionButtonDeposits.data("customerid", id);
        page.elements.actionButtonTransfers.data("customerid", id);
    };
    page.commands.styleCurrentSelectedRow = (row, isActive) => {
        page.elements.customerTableTrs.removeClass("active");
        row.addClass("active");
        if (
            row.data("customerid") === currentRow.data("customerid") &&
            isActive
        ) {
            row.removeClass("active");
        }
        currentRow = row;
    };
    page.loadData.findAllCustomer = () => {
        console.log(token)
        $.ajax({
            headers: {
                Authorization: token,
            },
            type: "GET",
            url: page.urls.getAllCustomers,
        }).done((data) => {
            page.commands.drawCustomerTableBody(data);
        });
    };
    page.loadData.getAllTransfer = () => {
        $.ajax({
            headers: {
                Authorization: token,
            },
            type: "GET",
            url: page.urls.getAllTransfers,
        }).done((data) => {
            $.each(data, (i, item) => {
                let sender = item.sender;
                let recipient = item.recipient;
                let tr = page.commands.createTransferRow(item, sender, recipient);
                page.elements.transferHistoryTbBody.prepend(tr);
            });
        });
    };
    page.loadData.findAllCustomerNot = (id) => {
        return $.ajax({
            headers: {
                Authorization: token,
            },
            type: "GET",
            url: page.urls.getAllCustomerNot + id,
        }).fail(() => {
            AppBase.SweetAlert.showErrorAlert("Customer not found");
        });
    };

    page.loadData.findCustomerById = (id) => {
        return $.ajax({
            headers: {
                Authorization: token,
            },
            type: "GET",
            url: page.urls.findCustomerById + `/${id}`,
        }).fail(() => {
            AppBase.SweetAlert.showErrorAlert("Customer not found");
        });
    };

    page.commands.createTableRow = (customer, locationRegion) => {
        return `
                <tr data-customerid = ${customer.id} class="tr_${customer.id} position-relative">
                    <td></td>
                    <td class="queue">${customer.id}</td>
                    <td>${customer.fullName}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td class="text-end">${Math.round(customer.balance)} $</td>
                    <td>${locationRegion.provinceName}</td>
                    <td>${locationRegion.districtName}</td>
                    <td>${locationRegion.wardName}</td>
                    <td>${locationRegion.address}</td>
                </tr>
                `;
    };
    page.commands.createTransferRow = (transfer, sender, recipient) => {
        let date = new Date(transfer.createdAt);
        return ` <tr>
                    <td>${transfer.id}</td>
                    <td>${sender.fullName}</td>
                    <td>${recipient.fullName}</td>
                    <td class="text-end">${Math.round(transfer.transferAmount)} $</td>
                    <td class="text-end">${Math.round(transfer.fees)}</td>
                    <td class="text-end">${Math.round(transfer.feesAmount)} $</td>
                    <td class="text-end">${Math.round(transfer.transactionAmount)} $</td>
                    <td class="text-center">${date.toLocaleDateString()} - ${date.toLocaleTimeString()}</td>
                </tr>
        `;
    };
    page.commands.createDepositRow = (deposit, customer) => {
        let date = new Date(deposit.createdAt);
        return ` <tr>
                    <td>${deposit.id}</td>
                    <td>${customer.fullName}</td>
                    <td class="text-end">${deposit.transactionAmount} $</td>
                    <td class="text-center">${date.toLocaleDateString()} - ${date.toLocaleTimeString()}</td>
                </tr>
`;
    };
    page.commands.drawCustomerTableBody = (data) => {
        $.each(data, (i, item) => {
            let locationRegion = item.locationRegion;
            let rowStr = page.commands.createTableRow(item, locationRegion);
            page.elements.customerTbBody.prepend(rowStr);
        });
        page.commands.addActionBtnsClickEvent();
    };

    page.commands.appendToCustomerTable = (customer, locationRegion) => {
        let tr = page.commands.createTableRow(customer, locationRegion);
        page.elements.customerTbBody.prepend(tr);
    };

    page.commands.createNewCustomer = () => {
        let locationRegion = new LocationRegion();
        let fullName = page.elements.customerFullNameCre.val();
        let email = page.elements.customerEmailCre.val();
        let phone = page.elements.customerPhoneCre.val();
        let address = page.elements.customerAddressCre.val();
        let provinceId = page.elements.inputProvince.eq(0).val();
        let provinceName = page.elements.inputProvince.eq(0)
            .find("option:selected")
            .text();
        let districtId = page.elements.inputDistrict.eq(0).val();
        let districtName = page.elements.inputDistrict.eq(0)
            .find("option:selected")
            .text();
        let wardId = page.elements.inputWard.eq(0).val();
        let wardName = page.elements.inputWard.eq(0).find("option:selected").text();
        let customer = new Customer(fullName, email, phone, address);
        locationRegion.provinceId = provinceId;
        locationRegion.provinceName = provinceName;
        locationRegion.districtId = districtId;
        locationRegion.districtName = districtName;
        locationRegion.wardId = wardId;
        locationRegion.wardName = wardName;
        locationRegion.address = address;
        customer.locationRegion = locationRegion;
        $.ajax({
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                Authorization: token
            },
            type: "POST",
            url: page.urls.createCustomer,
            data: JSON.stringify(customer),
        })
            .done((data) => {
                customer = data;
                locationRegion = customer.locationRegion;
                page.commands.appendToCustomerTable(customer, locationRegion);

                AppBase.SweetAlert.showSuccessAlert(
                    "New customer is created successfully!",
                );

                page.commands.removeActionBtnsClickEvents();
                page.commands.addActionBtnsClickEvent();
                page.commands.resetCreateCustomerForm();
            })
            .fail((jqXHR) => {
                let errors = jqXHR.responseJSON;

                let str = '';
                $.each(errors, (k, v) => {
                    str += `<li>${v}</li>`;
                })
                page.elements.customerCreErrorUl.css("display", "unset").addClass("show").removeClass("d-none");
                page.elements.customerCreErrorUl.empty().append(str)
            });
    };

    page.commands.editCustomerHandler = (id) => {
        page.loadData.findCustomerById(id).then((data) => {
            currentCustomer = data;
            page.commands.appendCurrentCustomerInfoToEditForm(data);
        });
    };
    page.commands.appendCurrentCustomerInfoToEditForm = (customer) => {
        page.elements.customerFullNameEdit.val(customer.fullName);
        page.elements.customerEmailEdit.val(customer.email);
        page.elements.customerPhoneEdit.val(customer.phone);
        page.elements.customerAddressEdit.val(customer.address);
       let loadCustomerProvince = async () =>{
           let province;
           let result =  await page.loadData.ajaxAllProvinces().then((data)=>{
               $.each(data.results, (i, item) => {
                   if (item.province_id ===  customer.locationRegion.provinceId){
                       province = item;
                       return;
                   };
               });
               page.elements.inputProvince.eq(1).find(`option[value=${province.province_id}]`).attr("selected", true).change();
               console.log(province)
           })
           page.elements.editCustomerModal.modal("show");
       }
        loadCustomerProvince();
        page.elements.editCustomerModal.on("shown.bs.modal",function (){
            console.log(2)
            page.elements.inputDistrict.eq(1).find(`option[value=${customer.locationRegion.districtId}]`).attr("selected", true).change();
            page.elements.inputWard.eq(1).find(`option[value=${customer.locationRegion.wardId}]`).attr("selected", true);
            return $(this).off("shown.bs.modal")
        })
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

        page.loadData
            .findCustomerById(id)
            .then(() => {
                $.ajax({
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        Authorization: token
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
        page.loadData.findCustomerById(id).then(() => {
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
                Authorization: token
            },
            type: "DELETE",
            url: page.urls.deleteCustomerById + `/${id}`
        })
            .done(() => {
                $(`.tr_${id}`).remove();
                AppBase.SweetAlert.showSuccessAlert(
                    "Customer is deleted successfully!",
                );
                page.elements.pageFooter.hide();
            })
            .fail(() => {
                AppBase.SweetAlert.showErrorAlert(
                    "Some thing went wrong, please try again later!",
                );
            });
    };

    page.commands.appendCustomerInfoToDepositModal = (id) => {
        page.elements.depositModal.modal("toggle");
        page.loadData.findCustomerById(id).then((data) => {
            currentCustomer = data;
            page.elements.depositCusName.val(currentCustomer.fullName);
            page.elements.depositCusEmail.val(currentCustomer.email);
            page.elements.depositCusBalance.val(currentCustomer.balance);
        });
    };

    // page.commands.increaseCustomerBalance = (id, transactionAmount) => {
    //     let newBalance;
    //     return page.loadData
    //         .findCustomerById(id)
    //         .then((customer) => {
    //             newBalance = customer.balance + transactionAmount;
    //         })
    //         .then(() => {
    //             return $.ajax({
    //                 headers: {
    //                     accept: "application/json",
    //                     "content-type": "application/json",
    //                 },
    //                 type: "PATCH",
    //                 url: page.urls.updateCustomerById + `/${id}`,
    //                 data: JSON.stringify({ balance: newBalance }),
    //             }).fail((error) => {
    //                 console.log(error);
    //             });
    //         });
    // };
    // page.commands.decreaseCustomerBalance = (id, transactionAmount) => {
    //     let newBalance;
    //     return page.loadData
    //         .findCustomerById(id)
    //         .then((customer) => {
    //             newBalance = customer.balance - transactionAmount;
    //         })
    //         .then(() => {
    //             return $.ajax({
    //                 headers: {
    //                     accept: "application/json",
    //                     "content-type": "application/json",
    //                 },
    //                 type: "PATCH",
    //                 url: page.urls.updateCustomerById + `/${id}`,
    //                 data: JSON.stringify({ balance: newBalance }),
    //             });
    //         });
    // };
    page.commands.createNewDepositRecord = () => {
        let id = currentCustomer.id;
        let transactionAmount = Number(page.elements.depositAmount.val());
        let deposit = new Deposit();
        deposit.customer = currentCustomer;
        deposit.transactionAmount = transactionAmount;

        $.ajax({
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                Authorization: token
            },
            type: "POST",
            url: page.urls.createNewDeposit,
            data: JSON.stringify(deposit),
        }).then((deposit) => {
            console.log(deposit)
            currentCustomer = deposit.customer;
            AppBase.SweetAlert.showSuccessAlert(
                `Deposit to ${currentCustomer.fullName} account successfully!`,
            );
            let trStr = page.commands.createTableRow(
                currentCustomer,
                currentCustomer.locationRegion,
            );
            $(`.tr_${id}`).replaceWith(trStr);

            page.elements.depositModal.modal("toggle");

            page.commands.removeActionBtnsClickEvents();
            page.commands.addActionBtnsClickEvent();

            let depositRow = page.commands.createDepositRow(deposit, currentCustomer);
            page.elements.depositHistoryTbBody.prepend(depositRow);

            page.elements.pageFooter.hide();
        });
    };

    page.commands.calculateTotalAmount = () => {
        let transferAmount = Number(page.elements.tfAmount.val());
        let totalAmount = transferAmount + (transferAmount / 100) * 10;
        $("#tfTotal").val(totalAmount);
    };

    page.commands.appendCustomerInfoToTransferModal = (id) => {
        page.loadData.findCustomerById(id).then((customer) => {
            currentCustomer = customer;
            page.elements.tfSenderCusName.val(currentCustomer.fullName);
            page.elements.tfSenderCusEmail.val(currentCustomer.email);
            page.elements.tfSenderCusBalance.val(currentCustomer.balance);
            page.elements.transferModal.modal("toggle");
            page.commands.appendCustomersToRecipientSelection(customer);
        });
        page.loadData.findAllCustomerNot(id).then((customers) => {
            page.commands.appendCustomersToRecipientSelection(customers);
        });
    };
    page.commands.appendCustomersToRecipientSelection = (customers) => {
        let htmls = customers.map((customer) => {
            return `
                <option value = ${customer.id}>(${customer.id}) ${customer.fullName}</option>
                `;
        });
        page.elements.recipientSelection.empty().prepend(htmls.join(""));
    };

    page.commands.doTransfer = () => {
        let recipientID = page.elements.recipientSelection.val();
        page.loadData.findCustomerById(recipientID).then((recipient) => {
            let transferAmount = Number(page.elements.tfAmount.val());
            let fees = 10;
            let transactionAmount = transferAmount + feeAmount;

            if (currentCustomer.id === recipient.id) {
                AppBase.SweetAlert.showErrorAlert(
                    "Sender and recipient must be different",
                );
            }
            if (currentCustomer.balance < transactionAmount) {
                AppBase.SweetAlert.showErrorAlert(
                    "Sender balance is not enough",
                );
            } else {
                let transfer = new Transfer();
                transfer.sender = currentCustomer;
                transfer.recipient = recipient;
                transfer.transferAmount = transferAmount;
                transfer.fees = fees;

                page.commands.createNewTransferRecord(transfer, recipient);
            }


        });
    };

    page.commands.createNewTransferRecord = (transfer) => {
        $.ajax({
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                Authorization: token
            },
            type: "POST",
            url: page.urls.createNewTransfer,
            data: JSON.stringify(transfer),
        })
            .done((transfer) => {

                let sender = transfer.sender;
                let recipient = transfer.recipient;

                console.log(sender);
                console.log(recipient);

                let senderRow = page.commands.createTableRow(
                    sender,
                    sender.locationRegion,
                );

                $(`.tr_${sender.id}`).replaceWith(senderRow);

                let recipientRow = page.commands.createTableRow(
                    recipient,
                    recipient.locationRegion,
                );
                $(`.tr_${recipient.id}`).replaceWith(recipientRow);

                let transferRow = page.commands.createTransferRow(transfer, sender, recipient);
                page.elements.transferHistoryTbBody.prepend(transferRow);


                AppBase.SweetAlert.showSuccessAlert(
                    "Transfer successfully!",
                );
                page.commands.removeActionBtnsClickEvents();
                page.commands.addActionBtnsClickEvent();
                page.elements.transferModal.modal("toggle");
                page.elements.pageFooter.hide();

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
        $.validator.setDefaults({errorElement: "li"});

        page.elements.createCustomerForm.validate({
            rules: customerValidationRules,

            messages: customerValidationMessages,

            errorLabelContainer: "#newCustomerModal .alert-danger",
            errorPlacement: function (error, element) {
                console.log(element);
                error.appendTo("#newCustomerModal .alert-danger");
            },
            showErrors: function (errorMap, errorList) {
                if (this.numberOfInvalids() > 0) {
                    $("#newCustomerModal .alert-danger")
                        .removeClass("d-none")
                        .addClass("show");
                } else {
                    $("#newCustomerModal .alert-danger")
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
        page.elements.depositForm.validate({
            rules: {
                depositAmount: {
                    required: true,
                    number: true,
                    min: 10,
                    max: 100000,
                    maxlength: 7,
                },
            },

            messages: {
                depositAmount: {
                    required: "Deposit amount is required",
                    number: "Transaction amount is not valid",
                    min: "Min transaction amount is ${0}$",
                    max: "Max transaction amount is ${0}$",
                    maxlength: "Max number of character is ${0}",
                },
            },

            errorLabelContainer: "#depositModal .alert-danger",
            errorPlacement: function (error, element) {
                console.log(element);
                error.appendTo("#depositModal .alert-danger");
            },
            showErrors: function (errorMap, errorList) {
                if (this.numberOfInvalids() > 0) {
                    $("#depositModal .alert-danger")
                        .removeClass("d-none")
                        .addClass("show");
                } else {
                    $("#depositModal .alert-danger")
                        .removeClass("show")
                        .addClass("d-none")
                        .empty();
                }
                this.defaultShowErrors();
            },
            submitHandler: function () {
                page.commands.createNewDepositRecord();
            },
        });
        page.elements.transferForm.validate({
            rules: {
                //     tfAmount: {
                //         required: true,
                //         number: true,
                //         min: 10,
                //         max: 100000,
                //         maxlength: 7,
                //     },
                //     tfRecipientID: {
                //         required: true,
                //         number: true,
                //         maxlength: 5,
                //     },
                // },
                //
                // messages: {
                //     tfAmount: {
                //         required: "Transfer amount is required",
                //         number: "Transaction amount is not valid",
                //         min: "Min transaction amount is ${0}$",
                //         max: "Max transaction amount is ${0}$",
                //         maxlength: "Max number of character is ${0}",
                //     },
                //     tfRecipientID: {
                //         required: "Recipient is required",
                //         number: "Recipient is not valid",
                //         maxlength: "Recipient is not valid",
                //     },
            },

            errorLabelContainer: "#transferModal .alert-danger",
            errorPlacement: function (error, element) {
                console.log(element);
                error.appendTo("#transferModal .alert-danger");
            },
            showErrors: function (errorMap, errorList) {
                if (this.numberOfInvalids() > 0) {
                    $("#transferModal .alert-danger")
                        .removeClass("d-none")
                        .addClass("show");
                } else {
                    $("#transferModal .alert-danger")
                        .removeClass("show")
                        .addClass("d-none")
                        .empty();
                }
                this.defaultShowErrors();
            },
            submitHandler: function () {
                page.commands.doTransfer();
            },
        });
    };

    return () => {
        page.commands.decodeCookie();

        page.loadData.findAllCustomer();

        page.loadData.getAllTransfer();

        page.loadData.getAddressInfo();

        page.loadData.getAllDeposits();

        page.commands.modalEventHandler();

        page.commands.mainBtnClickEventHandler();

        page.commands.validationHandler();

    };
}

window.onload = () => {
    let App = init();
    App();
};
