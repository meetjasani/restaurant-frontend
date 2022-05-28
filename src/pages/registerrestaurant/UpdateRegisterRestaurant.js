import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import NumberFormat from "react-number-format";
import { ApiPatch } from '../../helper/API/ApiData';

const UpdateRegisterRestaurant = ({ open, handleClose, data, setRestaurant }) => {
  // console.log(data);
  const [updateData, setUpdateData] = useState(data);
  const [picture, setPicture] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const { name, gstNo, address, contactNo, orderPrefix, isEnabled } = updateData;

  useEffect(() => {
    setUpdateData(data);
  }, [data])

  const onChange = (e) => {
    const id = e.target.type === 'radio' ? e.target.name : e.target.id;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    // console.log("Id", id, "Value", value);
    const _updateData = { ...updateData };

    if (id === 'logo') {
      setPicture(e.target.files[0]);
      return;
    }
    _updateData[id] = value;
    // console.log(_restaurantData);
    setUpdateData(_updateData);
  }

  const handleFormSubmit = () => {
    setErrMsg('');
    let errMsg = [];

    if (updateData.name === "") {
      errMsg.push('Name');
    }

    if (updateData.address === "") {
      errMsg.push('Address');
    }

    if (updateData.contactNo === "") {
      errMsg.push('Contact No');
    }

    if (errMsg.length > 0) {
      setErrMsg(`Enter ${errMsg.join(', ')}`);
      return;
    }

    const fd = new FormData();
    for (var key in updateData) {
      fd.append(key, updateData[key]);
    }
    fd.append('logo', picture);


    ApiPatch('license', fd).then((res) => {
      handleClose();
      setRestaurant();
    }).catch((error) => { setErrMsg(error.response.data.message) });

  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Update Restaurant
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
          <div className='mt-2 align-middle'>
            <label className="text-sm mr-2" htmlFor="flexCheckDefault">Entry Enabled</label>
            <input type='checkbox' id='isEnabled' className="h-4 w-4" value='' checked={isEnabled} onChange={onChange} />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div>
          <label className='dialogError'>{errMsg}</label>
          <div className='text-center w-full pb-3'>
            <button className='dialogBtnSave ml-1' onClick={handleFormSubmit}>Update</button>
            <button className='dialogBtnCancle ml-1' onClick={handleClose}>Cancle</button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateRegisterRestaurant