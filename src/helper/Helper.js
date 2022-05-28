import moment from "moment";

class Helper {

    static FUNCTIONALITY = {
        AVAILABLE_ITEMS: 'Available Items',
        AVAILABLE_TABLES: 'Available Table',
        USERS: 'Users',
        ORDERS_OPEN_ORDERS: 'Orders.OpenOrders',
        ORDERS_HISTORY: 'Orders.OrdersHistory',
        PICK_ORDER: 'Orders.PickOrder',
        INVOICE_HISTORY: 'Invoices.InvoiceHistory',
        GST_INVOICE: 'Invoices.GSTInvoice',
        MASTER_CATEGORY: 'Master.Category',
        MASTER_SUBCATEGORY: 'Master.Subcategory',
        MASTER_ITEM: 'Master.Item',
        MASTER_TABLE: 'Master.Table',
        ADMIN_MASTER_FUNCTIONALITY: 'AdminMaster.Functionality',
        ADMIN_MASTER_ROLE: 'AdminMaster.Role',
        MASTER_CUSTOMER: 'Master.Customer',
        WAITING_LIST: 'WaitingList',
        WAITING_LIST_HISTORY: 'WaitingListHistory',
        SETTING: 'Setting',
    }

    static CRUD = {
        VIEW: 'canView',
        INSERT: 'canInsert',
        UPDATE: 'canUpdate',
        DELETE: 'canDelete',
    }

    static BOOKING_TYPE = {
        IN_PERSON: 'In Person',
        ON_CALL: 'On Call'
    }

    static WAITING_STATUS = {
        WAITING: 'Waiting',
        ALLOCATED: 'Allocated',
        NOT_ARRIVED: 'Not arrived',
        LEFT: 'Left',
    }

    static ORDER_TYPE = {
        DINE_IN: 'dineIn',
        TAKE_AWAY: 'takeAway',
    }

    static ORDER_STATUS = {
        OPEN: 'open',
        IN_PROGRESS: 'inProgress',
        READY: 'ready',
        DELIVERED: 'closed',
    }

    // Returns Formate Like 1,23,456.00
    static GetFormatedAmount = (amount, withCrDr = false) => {
        let formatedAmount = withCrDr ? "0.00" : "0.00";

        if (amount) {
            formatedAmount = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
            }).format(Math.abs(amount));

            if (withCrDr) {
                amount < 0 ? formatedAmount += " Cr." : formatedAmount += " Dr.";
            }
        }

        return formatedAmount;
    }

    static GetFormatedDate = (date, formate = 'DD-MM-YYYY') => {
        return moment(date).format(formate);
    }

    static getArrayToString = (array, filedName) => {
        let result = [];
        for (const a of array) {
            result.push(a[filedName])
        }
        return result.join(', ');
    }

    static hasFunctionality = (user, functionality, CRUD) => {
        if (user?.rights !== undefined) {
            const index = user.rights.findIndex((right) => right.functionalityId.name === functionality)
            if (index !== -1) {
                return user.rights[index][CRUD]
            }
        }
        return false;
    }

    // static handleEnter = (event) => {
    //     //console.log(event.key.toLowerCase());
    //     if (event.key.toLowerCase() === "enter") {
    //         const form = event.target.form;
    //         const index = [...form].indexOf(event.target);
    //         if (form.elements[index + 1]) {
    //             form.elements[index + 1].focus();
    //         }
    //         else {
    //             form.elements[0].focus();
    //         }
    //         //event.preventDefault();
    //     }
    // };

    static setComboboxValue = (array, value) => {
        return array.filter((f) => f.value === value)
    };

    static GetLabelFromValue = (array, value) => {
        return array.filter((f) => f.value === value)[0].label
        // console.log("value", a[0].label);
        // return "Hello"
    }

    static GetTimeDiff = (start, end) => {
        const startTime = moment(start);
        const endTime = moment(end);
        var mins = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("mm")
        const totalTime = endTime.diff(startTime, 'hours') + ':' + mins
        return totalTime;
    }
}

export default Helper;