import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddFunctionality = ({ open, handleClose, data, onChange, handleFormSubmit, errMsg }) => {
    // console.log(data);
    const { _id, name, description, view, insert, update, drop, isEnabled, isDefault } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {!_id ? 'Add ' : 'Update '}Functionality
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" className='textBox' type='text' placeholder='Functionality Name' value={name} onChange={onChange} />
                    <textarea id="description" className='textBox' placeholder='Description' value={description} onChange={onChange} />
                    <fieldset className="orderFieldSet" style={{marginTop:'0px'}}>
                        <legend>Available Operations for Functionality</legend>
                        <div className='grid grid-cols-2 gap-2 text-right w-3/4'>
                            <div className='mt-2 items-center'>
                                <label className="text-sm mr-2" htmlFor="flexCheckDefault">View</label>
                                <input type='checkbox' id='view' className="h-4 w-4" value='' checked={view} onChange={onChange} />
                            </div>
                            <div className='mt-2 items-center'>
                                <label className="text-sm mr-2" htmlFor="flexCheckDefault">Insert</label>
                                <input type='checkbox' id='insert' className="h-4 w-4" value='' checked={insert} onChange={onChange} />
                            </div>
                            <div className='mt-2 items-center'>
                                <label className="text-sm mr-2" htmlFor="flexCheckDefault">Update</label>
                                <input type='checkbox' id='update' className="h-4 w-4" value='' checked={update} onChange={onChange} />
                            </div>
                            <div className='mt-2 items-center'>
                                <label className="text-sm mr-2" htmlFor="flexCheckDefault">Drop</label>
                                <input type='checkbox' id='drop' className="h-4 w-4" value='' checked={drop} onChange={onChange} />
                            </div>
                        </div>
                    </fieldset>
                    <div className='mt-2 items-center'>
                        <label className="text-sm mr-2" htmlFor="flexCheckDefault">Enabled</label>
                        <input type='checkbox' id='isEnabled' className="h-4 w-4" value='' checked={isEnabled} onChange={onChange} />
                    </div>
                    <div className='mt-2 items-center'>
                        <label className="text-sm mr-2" htmlFor="flexCheckDefault">Default</label>
                        <input type='checkbox' id='isDefault' className="h-4 w-4" value='' checked={isDefault} onChange={onChange} />
                    </div>
                    <label className='dialogError'>{errMsg}</label>
                </div>
            </DialogContent>
            <DialogActions>
                <div className='text-center w-full pb-3'>
                    <button className='dialogBtnSave ml-1' onClick={handleFormSubmit}>Save</button>
                    <button className='dialogBtnCancle ml-1' onClick={handleClose}>Cancle</button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default AddFunctionality