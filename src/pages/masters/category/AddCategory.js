import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddCategory = ({ open, handleClose, data, onChange, handleFormSubmit, errMsg }) => {
    // console.log(data);
    const { _id, name, description } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {!_id ? 'Add ' : 'Update '}Category
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" className='textBox pc-textboxname mb-4' type='text' placeholder='Category Name' value={name} onChange={onChange} />
                    <textarea id="description" className='textBox pc-textboxname' placeholder='Description' value={description} onChange={onChange} />
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

export default AddCategory