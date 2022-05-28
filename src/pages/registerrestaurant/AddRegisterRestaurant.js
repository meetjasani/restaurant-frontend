import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NumberFormat from "react-number-format";

const AddRegisterRestaurant = ({ open, handleClose, data, functionalities, onChange, handleAddItem, handleRemoveItem, toggleCheckAll, checkUsername, handleFormSubmit, errMsg }) => {
    // console.log(data);
    const { name, gstNo, address, contactNo, orderPrefix, licenseType, functionalityId, licenseEndDate, userLimit, itemLimit, tableLimit, username } = data;

    const onChangeChkBox = (id, checked) => {
        checked ? handleAddItem(id) : handleRemoveItem(id);
        document.getElementById('checkAll').checked = false;
    }

    const checkBoxValue = (id) => {
        const index = functionalityId.findIndex((res) => res === id)
        return index > -1
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Add Restaurant
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" className='textBox' type='text' placeholder='Restaurant Name' value={name} onChange={onChange} autoFocus />
                    <input id="gstNo" className='textBox' type='text' placeholder='Restaurant GST' value={gstNo} onChange={onChange} style={{ textTransform: 'capitalize' }} />
                    <input id="address" className='textBox' type='text' placeholder='Address' value={address} onChange={onChange} />
                    <NumberFormat
                        id="contactNo"
                        style={{ marginLeft: '0px', width: '71px', marginTop: '0px' }}
                        placeholder="Contact No"
                        className="textBox"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={false}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="12"
                        value={contactNo}
                        onChange={onChange}
                    />
                    <input id="logo" type="file" onChange={onChange} />
                    <input id="orderPrefix" className='textBox' type='text' placeholder='Order Prefix' value={orderPrefix} onChange={onChange} />
                    <select id="licenseType" value={licenseType} onChange={onChange}>
                        <option value="">Select License Type</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                    </select>
                    <div id="licenseEndDate" onChange={onChange} >
                        <label>Demo</label>
                        <input type="radio" value="7" name="licenseEndDate" />
                        <label>1 Month</label>
                        <input type="radio" value="30" name="licenseEndDate" />
                        <label>6 Month</label>
                        <input type="radio" value="180" name="licenseEndDate" />
                        <label>1 Year</label>
                        <input type="radio" value="364" name="licenseEndDate" />
                    </div>
                    <input id="licenseEndDate" type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' placeholder='Lic. End Date' value={licenseEndDate} onChange={onChange}  disabled={true}/>
                    <NumberFormat
                        id="userLimit"
                        style={{ marginLeft: '0px', width: '71px', marginTop: '0px' }}
                        placeholder="Users"
                        className="textBox"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={true}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="5"
                        value={userLimit}
                        onChange={onChange}
                    />
                    <NumberFormat
                        id="itemLimit"
                        style={{ marginLeft: '0px', width: '71px', marginTop: '0px' }}
                        placeholder="Items"
                        className="textBox"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={true}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="5"
                        value={itemLimit}
                        onChange={onChange}
                    />
                    <NumberFormat
                        id="tableLimit"
                        style={{ marginLeft: '0px', width: '71px', marginTop: '0px' }}
                        placeholder="Tables"
                        className="textBox"
                        thousandsGroupStyle="lakh"
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={true}
                        allowNegative={false}
                        decimalScale={0}
                        maxLength="5"
                        value={tableLimit}
                        onChange={onChange}
                    />
                    <div className='flex'>
                        <input id="username" className='textBox' type='text' placeholder='username' value={username} onChange={onChange} />
                        <button className="diplayTableTwoEditBtn" onClick={checkUsername}>Check Availability</button>
                    </div>
                    <table style={{ width: '100%' }} className="diplayTable">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>
                                    <input type='checkbox' id="checkAll" onChange={toggleCheckAll} />
                                </th>
                                <th>Functionality</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                functionalities.map((functionality, index) => {
                                    return (
                                        <tr key={functionality._id}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input type='checkbox'
                                                    checked={functionality.isDefault? true : checkBoxValue(functionality._id)}
                                                    onChange={e => onChangeChkBox(functionality._id, e.target.checked)}
                                                    disabled={functionality.isDefault}
                                                />
                                            </td>
                                            <td>{functionality.label}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </DialogContent>
            <DialogActions>
                <div>
                    <label className='dialogError'>{errMsg}</label>
                    <div className='text-center w-full pb-3'>
                        <button className='dialogBtnSave ml-1' onClick={handleFormSubmit}>Save</button>
                        <button className='dialogBtnCancle ml-1' onClick={handleClose}>Cancle</button>
                    </div>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default AddRegisterRestaurant