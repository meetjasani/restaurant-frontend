import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Helper from '../../Helper';
import NumberFormat from "react-number-format";

const ViewOrder = ({ open, handleClose, data }) => {
    const { date, orderNumber, tables, items, totalAmount, userId, updatedAt } = data;
    return (
        <Dialog open={open} onClose={handleClose} style={{ maxWidth: 'none !important' }}>
            <DialogTitle>
                <b>Order # </b>{orderNumber}
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col' >
                    <div className="flex items-center justify-between mb-2">
                        <label><b>Order Date : </b>{Helper.GetFormatedDate(date)}</label>
                        <label><b>Tables : </b>{Helper.getArrayToString(tables,"name")}</label>
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
                                <th style={{ textAlign: 'right', paddingRight: '5px' }}>{Helper.GetFormatedAmount(totalAmount)}</th>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="flex items-center justify-between mb-2">
                        <label><b>User : </b>{userId.name}</label>
                        <label><b>Updated : </b>{Helper.GetFormatedDate(updatedAt, 'DD-MM-YYYY hh:mm A')}</label>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewOrder