import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const Profile = ({ open, handleClose, data, name, onChange, handleFormSubmit, errMsg }) => {
    const { password, repeat_password } = data

    return (
        <Dialog open={open} onClose={handleClose} className="w-4/4">
            <DialogTitle className='text-center'>
                Hello {name}
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <div className='mb-2'>
                        <div className='mb-2'>
                            <label className='font-bold'>password</label>
                        </div>
                        <input
                            id="password"
                            className='textBox'
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={onChange}
                        />
                    </div>
                    <div className='mb-2'>
                        <div className='mb-2'>
                            <label className='font-bold'>Confirm Password</label>
                        </div>
                        <input
                            id="repeat_password"
                            className='textBox'
                            type='password'
                            placeholder='Confirm Password'
                            value={repeat_password}
                            onChange={onChange}
                        />
                    </div>
                    <label className='dialogError'>{errMsg}</label>
                </div>
            </DialogContent>
            <DialogActions>
                <div className='text-center w-full pb-3'>
                    <button className='dialogBtnSave ml-1 pc-diallogbtn ' onClick={handleFormSubmit}>Save</button>
                    <button className='dialogBtnCancle ml-1 pc-dialsavebtn' onClick={handleClose}>Cancle</button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default Profile