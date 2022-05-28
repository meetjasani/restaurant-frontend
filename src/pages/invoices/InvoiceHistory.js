import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Helper from "../../helper/Helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiGet, ApiPatch } from "../../helper/API/ApiData";
import ViewInvoice from "./ViewInvoice";

const initialData = {
    _id: "",
    date: "",
    invoiceNumber: "",
    customerId: {
        _id: "",
        name: "",
        contactNumber: "",
        gstNumber: ""
    },
    items: [
        {
            itemId: {
                _id: "",
                name: ""
            },
            quantity: 0,
            rate: 0,
            amount: 0
        }
    ],
    grossAmount: 0,
    tipAmount: 0,
    sgstRate: 0,
    cgstRate: 0,
    igstRate: 0,
    totalAmount: 0,
    paymentMethod: "",
    userId: {
        _id: "",
        name: ""
    }
}

const InvoiceHistory = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const [data, setData] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const url = 'invoice';
    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canUpdate: false, canDelete: false });

    const [canUpdate, setCanUpdate] = useState(false);
    const [searchDateF, setsearchDateF] = useState(moment().startOf('month').format("YYYY-MM-DD"));
    const [searchDateT, setsearchDateT] = useState(moment().format("YYYY-MM-DD"));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setFormData(initialData);
        setOpen(false);
    };

    const handleView = (oldData) => {
        if (oldData.customerId === undefined) {
            oldData.customerId = {
                _id: "",
                name: "",
                contactNumber: "",
                gstNumber: ""
            }
        }
        setFormData(oldData);
        handleClickOpen();
    }

    const onChange = (e) => {
        // console.log(e.target.id,"-",e.target.value);
        const _formData = { ...formData };

        const id = e.target.id.split('.')
        if (id.length > 1) {
            _formData[id[0]][id[1]] = e.target.value;
        } else {
            _formData[id[0]] = e.target.value;
        }
        if (e.target.id === 'sgstRate' || e.target.id === 'cgstRate' || e.target.id === 'igstRate') {
            if (e.target.id === 'igstRate') {
                _formData.sgstRate = 0
                _formData.cgstRate = 0
            } else {
                _formData.igstRate = 0
            }
            const sgstRate = _formData.sgstRate * _formData.grossAmount / 100
            const cgstRate = _formData.cgstRate * _formData.grossAmount / 100
            const igstRate = _formData.igstRate * _formData.grossAmount / 100
            _formData.totalAmount = _formData.grossAmount + sgstRate + cgstRate + igstRate + _formData.tipAmount
        }
        setFormData(_formData);
    }

    const handleUpdate = (closeDialog = true) => {
        setErrMsg('');
        const updateData = {
            _id: formData._id,
            customerId: formData.customerId._id,
            custName: formData.customerId.name,
            custGstNo: formData.customerId.gstNumber,
            contactNumber: formData.customerId.contactNumber,
            sgstRate: formData.sgstRate,
            cgstRate: formData.cgstRate,
            igstRate: formData.igstRate,
            totalAmount: formData.totalAmount,
            paymentMethod: formData.paymentMethod
        }
        console.log(updateData);

        if (updateData.custName !== "" || updateData.contactNumber !== "" || updateData.custGstNo !== "") {
            let errMsg = [];
            if (updateData.custName === "") {
                errMsg.push('Customer Name');
            }
            if (updateData.contactNumber === "") {
                errMsg.push('Customer Contact Number');
            }
            if (updateData.contactNumber.length < 10) {
                errMsg.push('Contact Number Must be 10 Digits');
            }
            if (errMsg.length > 0) {
                setErrMsg('Enter ' + errMsg.join(', '))
                return;
            }
        }

        ApiPatch(url, updateData).then((res) => {
            setInvoiceData();
            if (closeDialog) { handleClose(); }
        }).catch(err => setErrMsg(err.response.data.message))
    }

    const setInvoiceData = () => {
        ApiGet(`${url}?fromDate=${searchDateF}&toDate=${searchDateT}`).then((res) => {
            setData(res);
            const _csvData = []
            for (const invoice of res) {
                const expData = {
                    date: Helper.GetFormatedDate(invoice.date, "DD-MM-YYYY"),
                    number: invoice.invoiceNumber,
                    gross_Amount: invoice.grossAmount,
                    sGST_Rate: invoice.sgstRate + '%',
                    sGST_Amount: (invoice.grossAmount * invoice.sgstRate / 100),
                    cGST_Rate: invoice.cgstRate + '%',
                    cGST_Amount: (invoice.grossAmount * invoice.cgstRate / 100),
                    iGST_Rate: invoice.igstRate + '%',
                    iGST_Amount: (invoice.grossAmount * invoice.igstRate / 100),
                    net_Amount: invoice.totalAmount,
                    type: invoice.paymentMethod
                }
                _csvData.push(expData)
            }
            setCsvData(_csvData);
        }).catch((err) => window.alert(err))
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.INVOICE_HISTORY, Helper.CRUD.VIEW)) {
                history.push("/");
            }
        }
        setCanUpdate(Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.INVOICE_HISTORY, Helper.CRUD.UPDATE));
        setInvoiceData();
    }, [userData])

    let sgst = 0;
    let cgst = 0;
    let igst = 0;
    let totalCount = 0;
    let totalGross = 0;
    let totalScgst = 0;
    let totalIgst = 0;
    let totalGst = 0;
    let totalNet = 0;
    let cashTotal = 0;
    let cardTotal = 0;
    let upiTotal = 0;

    return (
        <>
            <h1 className="pageHeader">Invoices</h1>
            {/* <hr className="pageHeaderHr" /> */}
            <div className='pb-2 justify-between my-4 flex items-center'>
                <div>
                    <label className='transactionLabel mr-1'>From</label>
                    <input type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' value={searchDateF} onChange={e => setsearchDateF(e.target.value)} />
                    <label className='transactionLabel mx-1'>To</label>
                    <input type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' value={searchDateT} onChange={e => setsearchDateT(e.target.value)} />
                    <button type='button' className='orderBtnAdd ml-2' style={{ padding: '6px 8px' }} onClick={setInvoiceData}>Search</button>
                </div>
                <div>
                    <CSVLink
                        data={csvData}
                        filename={"invoices.csv"}
                        className="exe-file-genrator ml-2 pc-whitespace-sec "
                        target="_blank"
                    >
                        Get Excel
                    </CSVLink>
                </div>
            </div>
            <div className="diplayTable-custom p-4">
                <table className="invoice-table-content w-full">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}></th>
                            <th style={{ width: '50px', minWidth:'50px' }}>Sr</th>
                            <th style={{ width: '150px' , minWidth:'150px'}}>Number</th>
                            <th style={{ width: '100px', minWidth:'100px' }}>Date</th>
                            <th style={{ width: '150px', minWidth:'150px' }}>Gross</th>
                            <th style={{ width: '130px', minWidth:'130px' }}>Tip</th>
                            <th style={{ width: '90px', minWidth:'90px' }}>S + CGST</th>
                            <th style={{ width: '90px', minWidth:'90px' }}>IGST</th>
                            <th style={{ width: '90px', minWidth:'90px' }}>Total GST</th>
                            <th style={{ width: '150px', minWidth:'150px' }}>Net Amount</th>
                            <th style={{ width: '100px', minWidth:'100px' }}>Type</th>
                            <th style={{ width: '130px', minWidth:'130px' }}>User</th>
                            <th style={{ width: '150px', minWidth:'150px' }}>Updated Date/Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0
                                ?
                                data.map((invoice, index) => {
                                    cgst = invoice.grossAmount * invoice.cgstRate / 100;
                                    sgst = invoice.grossAmount * invoice.sgstRate / 100;
                                    igst = invoice.grossAmount * invoice.igstRate / 100;
                                    totalCount++;
                                    totalGross += invoice.grossAmount;
                                    totalScgst += (sgst + cgst);
                                    totalIgst += igst;
                                    totalGst += (sgst + cgst + igst);
                                    totalNet += (invoice.totalAmount);
                                    cashTotal += invoice.paymentMethod === 'CASH' ? invoice.totalAmount : 0;
                                    cardTotal += invoice.paymentMethod === 'CARD' ? invoice.totalAmount : 0;
                                    upiTotal += invoice.paymentMethod === 'UPI' ? invoice.totalAmount : 0;
                                    return (
                                        <tr key={invoice._id} className='table-content'>
                                            <td>
                                                <button className="flex items-center" onClick={(e) => { handleView(invoice) }}  style={{ width: '80px',minWidth:'80px' }}>
                                                    <span className="material-icons mr-2">
                                                        fullscreen
                                                    </span>
                                                    View
                                                </button>
                                                {/* <button className="diplayTableViewBtn flex items-center mx-auto" onClick={(e) => { handleView(invoice) }}>
                                                            <span className="material-icons mr-2"> fullscreen</span>
                                                            View
                                                        </button> */}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {index + 1}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {invoice.invoiceNumber}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedDate(invoice.date, 'DD-MM-YYYY')}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedAmount(invoice.grossAmount)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedAmount(invoice.tipAmount)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedAmount(sgst + cgst)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedAmount(igst)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedAmount(cgst + sgst + igst)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedAmount(invoice.totalAmount)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {invoice.paymentMethod}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {invoice.userId.name}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedDate(invoice.updatedAt, 'DD-MM-YYYY hh:mm A')}
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr key="noInvoice">
                                    <td colSpan={12} style={{ textAlign: 'center' }}>
                                        <b>No invoice in selected date range</b>
                                    </td>
                                </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>
                            </th>
                            <th>{totalCount}</th>
                            <th></th>
                            <th>Total</th>
                            <th>{Helper.GetFormatedAmount(totalGross)}</th>
                            <th>{Helper.GetFormatedAmount(totalScgst)}</th>
                            <th>{Helper.GetFormatedAmount(totalIgst)}</th>
                            <th>{Helper.GetFormatedAmount(totalGst)}</th>
                            <th>{Helper.GetFormatedAmount(totalNet)}</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
                <div style={{ display: "flex", flexDirection: "column", paddingTop: "50px" }}>
                    <h6 className="pb-3"><b style={{ color: "#ff6877" }}>Cash Total : </b>{Helper.GetFormatedAmount(cashTotal)}</h6>
                    <h6 className="pb-3"><b style={{ color: "#ff6877" }}>Card Total : </b>{Helper.GetFormatedAmount(cardTotal)}</h6>
                    <h6 className="pb-3"><b style={{ color: "#ff6877" }}>UPI Total : </b>{Helper.GetFormatedAmount(upiTotal)}</h6>
                </div>
                <ViewInvoice
                    open={open}
                    handleClose={handleClose}
                    data={formData}
                    canUpdate={canUpdate}
                    onChange={onChange}
                    handleUpdate={handleUpdate}
                    errMsg={errMsg}
                />
            </div>
        </>
    )
}

export default InvoiceHistory