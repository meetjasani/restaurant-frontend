import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NumberFormat from "react-number-format";


const AddUser = ({ open, handleClose, data, roles, onChange, handleFormSubmit, errMsg }) => {
    const { _id, name, username, mobileNumber, roleId, isEnabled } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className='add-title'>
                {!_id ? 'Add ' : 'Update '}User
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" className='textBox pc-text-secbox mb-2 ' type='text' placeholder='Name' value={name} onChange={onChange} autoFocus />
                    <input id="username" className='textBox' type='text' placeholder='Username' value={username} onChange={onChange} />
                    <NumberFormat
                        id="mobileNumber"
                        placeholder="Mobile Number (User ID)"
                        className="border-solid border  border-black rounded-br-md mt-2 mb-2 w-full rounded px-2 py-3 pc-input-box"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={false}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="10"
                        value={mobileNumber}
                        onChange={onChange}
                      
                    />

                    <div className='relative w-full'>
                        <select id="roleId" className='select w-full pc-selectbox-sec' value={roleId} onChange={onChange}>
                            <option value="">Select Role</option>
                            {
                                roles.map((role) => {
                                    return (
                                        <option key={role._id} value={role._id}>{role.label}</option>
                                    )
                                })
                            }
                        </select>




                        {/* <div className='dropdown-arrow-select'
                            onClick={() => {
                                onHostDatePickerClick("roleId");
                            }}>
                            <span className="material-icons">
                                arrow_drop_down
                            </span>
                        </div> */}


                    </div>
                    <div className='mt-2 align-middle'>
                        <label className="text-sm mr-2" htmlFor="flexCheckDefault">User Enabled</label>
                        <input type='checkbox' id='isEnabled' className="h-4 w-4" value='' checked={isEnabled} onChange={onChange} />
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

export default AddUser  