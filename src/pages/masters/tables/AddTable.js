import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NumberFormat from "react-number-format";

const AddTable = ({ open, handleClose, data, onChange, handleFormSubmit, errMsg }) => {
    const { _id, name, capicity, description, entryEnabled, sequanceNo } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {!_id ? 'Add ' : 'Update '}Table
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" autoFocus={true} className='textBox pc-textboxname mb-4' type='text' placeholder='Item Name' value={name} onChange={onChange} />
                    <NumberFormat
                        className='textBox pc-textboxname mb-4'
                        placeholder="Capicity"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={false}
                        allowNegative={false}
                        decimalScale={0}
                        value={capicity}
                        maxLength="3"
                        id="capicity"
                        onChange={(e) => { onChange(e) }}
                    />
                    <textarea id="description" className='textBox pc-textboxname mb-4' placeholder='Description' value={description} onChange={onChange} />
                    <NumberFormat
                        className='textBox pc-textboxname mb-4'
                        placeholder="Seq No"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={false}
                        allowNegative={false}
                        decimalScale={0}
                        value={sequanceNo}
                        maxLength="3"
                        id="sequanceNo"
                        onChange={(e) => { onChange(e) }}
                    />
                    <div className='mt-2 align-middle'>
                        <label className="text-sm mr-2" htmlFor="flexCheckDefault">Entry Enabled</label>
                        <input type='checkbox' id='entryEnabled' className="h-4 w-4" value='' checked={entryEnabled} onChange={onChange} />
                    </div>
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

export default AddTable