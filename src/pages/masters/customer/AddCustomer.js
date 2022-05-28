import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NumberFormat from "react-number-format";

const AddCustomer = ({ open, handleClose, data, onChange, handleFormSubmit, errMsg }) => {
    const { _id, name, contactNumber, gstNumber } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {!_id ? 'Add ' : 'Update '}Item
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" autoFocus={true} className='textBox pc-textboxname mb-4' type='text' placeholder='Item Name' value={name} onChange={onChange} />
                    <NumberFormat
                        id="contactNumber"
                        placeholder="Contact Number"
                        className="textBox pc-textboxname mb-4"
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
                    />
                    <input id="gstNumber" className='textBox pc-textboxname' type='text' placeholder='GST Number' maxLength={15} value={gstNumber} onChange={onChange} style={{textTransform:'uppercase'}}/>
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

export default AddCustomer