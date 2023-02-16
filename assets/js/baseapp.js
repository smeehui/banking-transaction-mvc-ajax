class AppBase {
    static DOMAIN_API = "http://localhost:3300";

    static SweetAlert = class {
        static showDeleteConfirmDialog() {
            return Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });
        }

        static showSuccessAlert(t) {
            Swal.fire({
                icon: "success",
                title: t,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });
        }

        static showErrorAlert(t) {
            Swal.fire({
                icon: "error",
                title: "Warning",
                text: t,
            });
        }

        static showError401() {
            Swal.fire({
                icon: "error",
                title: "Access Denied",
                text: "Invalid credentials!",
            });
        }

        static showError403() {
            Swal.fire({
                icon: "error",
                title: "Access Denied",
                text: "You are not authorized to perform this function!",
            });
        }
    };
}

class Customer {
    constructor(fullName, email, phone, address, balance = 0, deleted = 0) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.balance = balance;
        this.deleted = deleted;
    }
}

class Deposit {
    constructor(
        customerId,
        customerName,
        transactionAmount,
        date = new Date(),
    ) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.transactionAmount = transactionAmount;
        this.date = date;
    }
}

class Transfer {
    constructor(
        senderID,
        senderName,
        recipientID,
        recipientName,
        transferAmount,
        fee,
        feeAmount,
        transactionAmount,
        date = new Date(),
    ) {
        this.senderID = senderID;
        this.senderName = senderName;
        this.recipientID = recipientID;
        this.recipientName = recipientName;
        this.transferAmount = transferAmount;
        this.fee = fee;
        this.feeAmount = feeAmount;
        this.transactionAmount = transactionAmount;
        this.date = date;
    }
}

class LocationRegion {
    constructor(
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName,
        address,
    ) {
        this.provinceId = provinceId;
        this.provinceName = provinceName;
        this.districtId = districtId;
        this.districtName = districtName;
        this.wardId = wardId;
        this.wardName = wardName;
        this.address = address;
    }
}
