import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Helper from "../../helper/Helper";
import NumberFormat from "react-number-format";
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

const ViewInvoice = ({ open, handleClose, data, canUpdate, onChange, handleUpdate, errMsg }) => {
    // console.log(data);
    const { _id, date, invoiceNumber, customerId, items, grossAmount, tipAmount, sgstRate, cgstRate, igstRate, totalAmount, paymentMethod, userId } = data;
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice-${invoiceNumber}`,
    })

    const handleUpdateAndPrint = () => {
        if (canUpdate) {
            handleUpdate(false);
        }
        handlePrint();
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} style={{ maxWidth: 'none !important' }} ref={componentRef}>
                <DialogTitle>
                    <div className='invHeader'>
                        <h1>Shree Restaurant</h1>
                        <h2>GST : 24ABCDE1234A1Z</h2>
                        <h3>Abc complex, Xzy road, Varachha, Surat - 395006</h3>
                    </div>
                    <b>Invoice # </b>{invoiceNumber}
                </DialogTitle>
                <DialogContent style={{ paddingBottom: '1px' }}>
                    <div className='flex flex-col' >

                        <div className="flex items-center justify-between">
                            <label><b>Invoice Date : </b>{Helper.GetFormatedDate(date)}</label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <label><b>Customer Name : </b></label>
                                <input id="customerId.name" className='textBox' style={{ width: '180px' }} type='text' placeholder='Customer Name' autoFocus value={customerId.name} onChange={onChange} disabled={!canUpdate} />
                            </div>
                            <div>
                                <label><b>Customer GST Number : </b></label>
                                <input id="customerId.gstNumber" className='textBox' type='text' placeholder='GST Number' maxLength={15} style={{ width: '150px', textTransform: 'uppercase' }} value={customerId.gstNumber} onChange={onChange} disabled={!canUpdate} />
                            </div>
                        </div>
                        <div>
                            <label><b>Customer Contact : </b></label>
                            <NumberFormat
                                id="customerId.contactNumber"
                                style={{ marginLeft: '0px', width: '150px', marginTop: '0px' }}
                                placeholder="Contact Number"
                                className="textBox"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={false}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="10"
                                value={customerId.contactNumber}
                                onChange={onChange}
                                disabled={!canUpdate}
                            />
                        </div>
                        <table style={{ width: '100%', minWidth: '700px', marginBottom: '8px' }} className="diplayTable">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>Sr</th>
                                    <th>Item</th>
                                    <th style={{ width: '50px' }}>Qty</th>
                                    <th style={{ width: '100px' }}>Rate</th>
                                    <th style={{ width: '100px' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    items.map((item, index) => {
                                        const itemid = item.itemId;
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.itemId.name}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {item.quantity}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {Helper.GetFormatedAmount(item.rate)}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {Helper.GetFormatedAmount(item.amount)}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>Total</th>
                                    <th style={{ textAlign: 'right', paddingRight: '5px' }}>{Helper.GetFormatedAmount(grossAmount)}</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td style={{ textAlign: 'center' }}>Tip</td>
                                    <td style={{ textAlign: 'right', paddingRight: '5px' }}>{Helper.GetFormatedAmount(tipAmount)}</td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>Total</th>
                                    <th style={{ textAlign: 'right', paddingRight: '5px' }}>{Helper.GetFormatedAmount(grossAmount + tipAmount)}</th>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="flex items-center justify-between pb-6">
                            <div>
                                <div className="grid grid-cols-3 gap-1" style={{ width: '218px' }}>
                                    <center><b>SGST(%)</b></center>
                                    <center><b>CGST(%)</b></center>
                                    <center><b>IGST(%)</b></center>
                                    <div>
                                        <NumberFormat
                                            id="sgstRate"
                                            style={{ marginLeft: '0px', width: '71px', marginTop: '0px' }}
                                            placeholder="SGST(%)"
                                            className="textBox"
                                            thousandsGroupStyle="lakh"
                                            decimalSeparator="."
                                            displayType="input"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            decimalScale={2}
                                            maxLength="5"
                                            value={sgstRate}
                                            onChange={onChange}
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                    <div>
                                        <NumberFormat
                                            id="cgstRate"
                                            style={{ marginLeft: '1px', width: '71px', marginTop: '0px' }}
                                            placeholder="CGST(%)"
                                            className="textBox"
                                            thousandsGroupStyle="lakh"
                                            decimalSeparator="."
                                            displayType="input"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            decimalScale={2}
                                            maxLength="5"
                                            value={cgstRate}
                                            onChange={onChange}
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                    <div>
                                        <NumberFormat
                                            id="igstRate"
                                            style={{ marginLeft: '1px', width: '71px', marginTop: '0px' }}
                                            placeholder="IGST(%)"
                                            className="textBox"
                                            thousandsGroupStyle="lakh"
                                            decimalSeparator="."
                                            displayType="input"
                                            type="text"
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            decimalScale={2}
                                            maxLength="5"
                                            value={igstRate}
                                            onChange={onChange}
                                            disabled={!canUpdate}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '4px' }}>
                                    <label><b>Net Amount : </b>{Helper.GetFormatedAmount(totalAmount)}</label>
                                </div>
                            </div>
                            <div className='noPrintButton'>
                                <button type='button' className='orderBtnAdd' style={{ width: '75px', height: '35px' }} onClick={handleUpdate} disabled={!canUpdate}>Update</button>
                                <button type='button' className='orderBtnAdd ml-2' style={{ width: '130px', height: '35px' }} onClick={handleUpdateAndPrint}>{canUpdate ? "Update & " : ""}Print</button>
                            </div>
                        </div>
                        <label className='dialogError'>{errMsg}</label>
                        <div className='invFooter'>
                            Subject to surat judicial
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default ViewInvoice