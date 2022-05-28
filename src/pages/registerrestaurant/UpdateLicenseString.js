import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment';
import { useEffect, useState } from 'react';
import NumberFormat from "react-number-format";
import { ApiPatch } from '../../helper/API/ApiData';
import Helper from '../../helper/Helper';

const UpdateLicenseString = ({ open, handleClose, data, functionalities, setRestaurant }) => {
    // console.log(data);
    const [restaurantData, setRestaurantData] = useState(data);
    const [errMsg, setErrMsg] = useState("");
    const { licenseType, functionalityId, licenseEndDate, userLimit, itemLimit,tableLimit, createdAt } = restaurantData;

    useEffect(() => {
        setRestaurantData(data);
    }, [data])


    const onChangeChkBox = (id, checked) => {
        checked ? handleAddItem(id) : handleRemoveItem(id);
        document.getElementById('checkAll').checked = false;
    }

    const checkBoxValue = (id) => {
        const index = functionalityId.findIndex((res) => res === id)
        return index > -1
    }

    const handleRemoveItem = (id) => {
        const _formData = JSON.parse(JSON.stringify(restaurantData));
        _formData.functionalityId = _formData.functionalityId.filter((functionality) => functionality !== id);
        setRestaurantData(_formData);
    }

    const toggleCheckAll = (e) => {
        const checked = e.target.checked;
        const _formData = JSON.parse(JSON.stringify(restaurantData));
        _formData.functionalityId = [];
        if (checked) {
            functionalities.map(res => {
                // if (!res.isDefault) {
                    _formData.functionalityId.push(res._id)
                // }
            });
        } else {
            functionalities.map(res => {
                if (res.isDefault) {
                    _formData.functionalityId.push(res._id)
                }
            });
        }
        // console.log(_formData);
        setRestaurantData(_formData);
    }

    const handleAddItem = (id) => {
        setErrMsg('')
        if (id !== "") {
            const _formData = JSON.parse(JSON.stringify(restaurantData));
            const index = _formData.functionalityId.findIndex((res) => res.functionalityId === id)
            if (index < 0) {
                _formData.functionalityId.push(id);
                setRestaurantData(_formData);
            } else {
                setErrMsg('Functionality already added')
            }
        }

    }

    const onChange = (e) => {
        const id = e.target.type === 'radio' ? e.target.name : e.target.id;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        // console.log("Id", id, "Value", value);
        const _restaurantData = { ...restaurantData };

        if (id === 'licenseEndDate') {
            value = moment(createdAt).add(value, 'days').format('YYYY-MM-DD')
        }

        _restaurantData[id] = value;
        console.log(_restaurantData);
        setRestaurantData(_restaurantData);
    }

    const handleFormSubmit = () => {
        setErrMsg('');
        let errMsg = [];

        if (restaurantData.licenseType === "") {
            errMsg.push('License Type');
        }

        if (restaurantData.licenseEndDate === "") {
            errMsg.push('License End Date');
        }

        if (restaurantData.userLimit === "" || restaurantData.userLimit === 0) {
            errMsg.push('User Limit');
        }

        if (restaurantData.itemLimit === "" || restaurantData.itemLimit === 0) {
            errMsg.push('Item Limit');
        }

        if (restaurantData.functionalityId.length === 0) {
            errMsg.push('Functionalities');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        ApiPatch('licString', restaurantData).then((res) => {
            handleClose();
            setRestaurant();
        }).catch((error) => { setErrMsg(error.response.data.message) });

    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Update License
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
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
                    <input id="licenseEndDate" type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' placeholder='Lic. End Date' value={Helper.GetFormatedDate(licenseEndDate, "YYYY-MM-DD")} onChange={onChange} disabled={true} />
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
                                                    checked={functionality.isDefault ? true : checkBoxValue(functionality._id)}
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
                        <button className='dialogBtnSave ml-1' onClick={handleFormSubmit}>Update</button>
                        <button className='dialogBtnCancle ml-1' onClick={handleClose}>Cancle</button>
                    </div>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateLicenseString