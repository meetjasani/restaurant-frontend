import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NumberFormat from "react-number-format";
import Helper from '../../helper/Helper';

const AddWaitingList = ({ open, handleClose, data, customers, onChange, handleFormSubmit, errMsg }) => {
    const { _id, customerName, contactNumber, bookingType, persons, comments } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className='add-title'>
                {_id ? 'Add ' : 'Update '}Waiting List
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id='customerName' type="text" className="textBox mb-2" placeholder="Customer Name" value={customerName} onChange={onChange} />
                    <NumberFormat
                        id="contactNumber"
                        style={{  minHeight: '38px', width: '100px' }}
                        placeholder="Contact Number"
                        className="textBox mb-1s"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={false}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="10"
                        value={contactNumber}
                        onChange={onChange}
                    // onValueChange={e => { setQuantity(e.value) }}
                    />
                    <select id="bookingType" value={bookingType} onChange={onChange} className="select pc-selectbox-sec-1 ">
                        <option value="">Select Booking Type</option>
                        <option value={Helper.BOOKING_TYPE.IN_PERSON}>{Helper.BOOKING_TYPE.IN_PERSON}</option>
                        <option value={Helper.BOOKING_TYPE.ON_CALL}>{Helper.BOOKING_TYPE.ON_CALL}</option>
                    </select>
                    <NumberFormat
                        id="persons"
                        style={{  minHeight: '38px', width: '100px' }}
                        placeholder="Persons"
                        className="textBox mb-2"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={false}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="10"
                        value={persons}
                        onChange={onChange}
                    // onValueChange={e => { setQuantity(e.value) }}
                    />
                    <textarea id='comments' className="textBox" placeholder="Special Request" value={comments} onChange={onChange} />
                    <label className='dialogError'>{errMsg}</label>
                </div>
            </DialogContent>
            <DialogActions>
                <div className='text-center w-full pb-3'>
                    <button className='dialogBtnSave ml-1 pc-diallogbtn' onClick={handleFormSubmit}>Save</button>
                    <button className='dialogBtnCancle ml-1 pc-dialsavebtn' onClick={handleClose}>Cancle</button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default AddWaitingList