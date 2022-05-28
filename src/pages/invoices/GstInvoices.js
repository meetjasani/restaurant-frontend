import moment from "moment";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Helper from "../../helper/Helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiGet } from "../../helper/API/ApiData";

const initialData = {
    _id: "",
    date: "",
    invoiceNumber: "",
    custName: "",
    custGstNo: "",
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

const GstInvoices = () => {
    const [data, setData] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [searchDateF, setsearchDateF] = useState(moment().startOf('month').format("YYYY-MM-DD"));
    const [searchDateT, setsearchDateT] = useState(moment().format("YYYY-MM-DD"));
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const url = 'invoice/g';
    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canUpdate: false, canDelete: false });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFormData(initialData);
        setOpen(false);
    };

    const handleView = (oldData) => {
        setFormData(oldData);
        handleClickOpen();
    }

    const setInvoiceData = () => {
        ApiGet(`${url}?fromDate=${searchDateF}&toDate=${searchDateT}`).then((res) => {
            setData(res);
            const _csvData = []
            for (const invoice of res) {
                const expData = {
                    date: Helper.GetFormatedDate(invoice.date, "DD-MM-YYYY"),
                    number: invoice.invoiceNumber,
                    customer: invoice.custName,
                    gst_Number: invoice.custGstNo?.toUpperCase(),
                    gross_Amount: invoice.grossAmount,
                    sGST_Rate: invoice.sgstRate + '%',
                    sGST_Amount: (invoice.grossAmount * invoice.sgstRate / 100),
                    cGST_Rate: invoice.cgstRate + '%',
                    cGST_Amount: (invoice.grossAmount * invoice.cgstRate / 100),
                    iGST_Rate: invoice.igstRate + '%',
                    iGST_Amount: (invoice.grossAmount * invoice.igstRate / 100),
                    net_Amount: invoice.totalAmount
                }
                _csvData.push(expData)
            }
            setCsvData(_csvData);
        }).catch((err) => console.log(err.response.data.message))
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.GST_INVOICE, Helper.CRUD.VIEW)) {
                history.push("/");
            }
        }
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

    return (
        <>
            <h1 className="pageHeader">GST Invoices</h1>
            {/* <hr className="pageHeaderHr" /> */}
            <div className='pb-2 justify-between flex my-4 items-center'>
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
                        filename={"gst_invoices.csv"}
                        className="exe-file-genrator ml-2 pc-whitespace-sec"
                        target="_blank"
                    >
                        Get Excel
                    </CSVLink>
                </div>
            </div>
            <div className="diplayTable-custom p-4">
                <table className="user-table-content w-full">
                    <thead>
                        <tr>
                            <th style={{ width: '50px',minWidth:'50px'}}>Sr</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Number</th>
                            <th style={{ width: '100px',minWidth:'100px' }}>Date</th>
                            <th style={{ width: '120px',minWidth:'120px' }}>Customer</th>
                            <th style={{ width: '120px',minWidth:'120px' }}>GST Number</th>
                            <th style={{ width: '180px',minWidth:'180px' }}>Gross</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Tip</th>
                            <th style={{ width: '130px' ,minWidth:'130px'}}>S + CGST</th>
                            <th style={{ width: '100px',minWidth:'100px' }}>IGST</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Total GST</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Net Amount</th>
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
                                    return (
                                        <tr key={invoice._id} className='table-content'>
                                            <td style={{ textAlign: 'center' }}>
                                                {index + 1}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {invoice.invoiceNumber}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {Helper.GetFormatedDate(invoice.date, 'DD-MM-YYYY')}
                                            </td>
                                            <td>
                                                {invoice.custName}
                                            </td>
                                            <td style={{ textTransform: 'uppercase' }}>
                                                {invoice.custGstNo}
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
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={10} style={{ textAlign: 'center' }}>
                                        <b>No invoice in selected date range</b>
                                    </td>
                                </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>{totalCount}</th>
                            <th></th>
                            <th>Total</th>
                            <th></th>
                            <th></th>
                            <th>{Helper.GetFormatedAmount(totalGross)}</th>
                            <th>{Helper.GetFormatedAmount(totalScgst)}</th>
                            <th>{Helper.GetFormatedAmount(totalIgst)}</th>
                            <th>{Helper.GetFormatedAmount(totalGst)}</th>
                            <th>{Helper.GetFormatedAmount(totalNet)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default GstInvoices