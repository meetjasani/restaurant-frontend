import React from 'react'
import { useEffect, useState } from "react"
import { ApiDelete, ApiGet, ApiPost } from "../../helper/API/ApiData";
import moment from 'moment'
import AddRegisterRestaurant from './AddRegisterRestaurant';
import Helper from '../../helper/Helper';
import UpdateRegisterRestaurant from './UpdateRegisterRestaurant';
import UpdateLicenseString from './UpdateLicenseString';
import RenewLicenseString from './RenewLicenseString';

const RestaurantData = {
    name: "",
    gstNo: "",
    address: "",
    contactNo: "",
    orderPrefix: "",
    licenseType: "restaurant",
    functionalityId: [],
    licenseEndDate: "",
    userLimit: "",
    itemLimit: "",
    tableLimit: "",
    username: ""
}

const Restaurant_Err = {
    restaurantNameError: "",
    restaurantGSTNoErr: "",
    restaurantLogoError: "",
    restaurantLicenseTypeError: "",
    licenseEndDateError: "",
    userLimitError: "",
    itemLimitError: "",
    orderPrefixError: "",
    usernameError: "",
    functionalityIdError: "",
};

const UpdateData = {
    _id: "",
    name: "",
    gstNo: "",
    address: "",
    contactNo: "",
    orderPrefix: "",
    isEnabled: true,
}

const UpdateLicense = {
    licenseType: "",
    functionalityId: [],
    licenseEndDate: "",
    userLimit: "",
    itemLimit: "",
    isEnabled: true,
}

const RegisterRestaurant = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openUpdateLicense, setOpenUpdateLicense] = useState(false);
    const [openRenewLicense, setOpenRenewLicense] = useState(false);
    const [restaurantData, setRestaurantData] = useState(RestaurantData);
    const [updateData, setUpdateData] = useState(UpdateData);
    const [updateLicenseData, setUpdateLicenseData] = useState(UpdateLicense);
    const [renewLicenseData, setRenewLicenseData] = useState(UpdateLicense);
    const [restaurantList, setRestaurantList] = useState([]);
    const [picture, setPicture] = useState({});
    const [functionalityList, setFunctionalityList] = useState([]);
    const [usernameFlag, setUsernameFlag] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    // Insert
    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setErrMsg('');
        setRestaurantData(RestaurantData);
        setOpenAdd(false);
    };

    // Update License
    const handleClickOpenUpdate = () => {
        setOpenUpdate(true);
    };

    const handleCloseUpdate = () => {
        setErrMsg('');
        setUpdateData(UpdateData);
        setOpenUpdate(false);
    };

    // Update License string
    const handleClickOpenUpdateLicense = () => {
        setOpenUpdateLicense(true);
    };

    const handleCloseUpdateLicense = () => {
        setErrMsg('');
        setUpdateLicenseData(UpdateLicense);
        setOpenUpdateLicense(false);
    };


    // Renew License string
    const handleClickOpenRenewLicense = () => {
        setOpenRenewLicense(true);
    };

    const handleCloseRenewLicense = () => {
        setErrMsg('');
        setRenewLicenseData(UpdateLicense);
        setOpenRenewLicense(false);
    };

    const setFunctionalityData = () => {
        ApiGet('functionality/a').then((res) => {
            setFunctionalityList(res);
            const _restaurantData = { ...restaurantData };
            for (const key of res) {
                if (key.isDefault) {
                    // console.log(key._id);
                    _restaurantData.functionalityId.push(key._id)
                }
            }
            setRestaurantData(_restaurantData);
        }).catch((err) => console.log(err))
    }

    const setRestaurant = () => {
        ApiGet('license').then((res) => {
            setRestaurantList(res);
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        setFunctionalityData();
        setRestaurant();
    }, [])

    const onChange = (e) => {
        const id = e.target.type === 'radio' ? e.target.name : e.target.id;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        // console.log("Id", id, "Value", value);
        const _restaurantData = { ...restaurantData };

        if (id === 'logo') {
            setPicture(e.target.files[0]);
            return;
        }

        if (id === 'licenseEndDate') {
            value = moment().add(value, 'days').format('YYYY-MM-DD')
        }

        if (id === 'username') {
            setUsernameFlag(false);
        }
        _restaurantData[id] = value;
        // console.log(_restaurantData);
        setRestaurantData(_restaurantData);
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
            // console.log(_formData);
        }

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
            functionalityList.map(res => {
                // if (!res.isDefault) {
                _formData.functionalityId.push(res._id)
                // }
            });
        } else {
            functionalityList.map(res => {
                if (res.isDefault) {
                    _formData.functionalityId.push(res._id)
                }
            });;
        }
        setRestaurantData(_formData);
    }

    const checkUsername = (e) => {
        setErrMsg('');
        setUsernameFlag(false);
        const _formData = JSON.parse(JSON.stringify(restaurantData));
        if (_formData.username.length >= 3) {
            ApiGet(`user/${_formData.username}`).then(res => {
                if (!res) {
                    _formData.username = ""
                    setRestaurantData(_formData);
                    setErrMsg('Username not available select something else');
                } else {
                    setErrMsg('Username available');
                    setUsernameFlag(true);
                }
            })
        } else {
            setErrMsg('Username must be atleast 3 character long')
        }
    }

    const handleFormSubmit = () => {
        setErrMsg('');
        let errMsg = [];
        // console.log(restaurantData);

        if (restaurantData.name === "") {
            errMsg.push('Name');
        }

        if (restaurantData.address === "") {
            errMsg.push('Address');
        }

        if (restaurantData.contactNo === "") {
            errMsg.push('Contact No');
        }

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

        if (restaurantData.username === "") {
            errMsg.push('Username');
        }

        if (restaurantData.functionalityId.length === 0) {
            errMsg.push('Functionalities');
        }

        if (!usernameFlag) {
            errMsg.push('Check username availability');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        const fd = new FormData();
        for (var key in restaurantData) {
            if (key === 'functionalityId') {
                for (var functionality in restaurantData[key]) {
                    fd.append('functionalityId', restaurantData[key][functionality]);
                }
            } else {
                fd.append(key, restaurantData[key]);
            }
        }
        fd.append('logo', picture);

        ApiPost('license', fd).then((res) => {
            setRestaurant();
            handleCloseAdd();
        }).catch((error) => {
            setErrMsg(error.response.data.message)
        });
    }

    const handleEdit = (oldData) => {
        const RestaurantData = {
            _id: oldData._id,
            name: oldData.name,
            gstNo: oldData.gstNo,
            address: oldData.address,
            contactNo: oldData.contactNo,
            orderPrefix: oldData.orderPrefix,
            isEnabled: oldData.isEnabled
        }
        setUpdateData(RestaurantData);
        handleClickOpenUpdate();
    }

    const handleLicenseEdit = (oldData) => {
        const _updateLicense = {
            _id: oldData._id,
            licenseId: oldData.licenseId,
            licenseType: oldData.licenseType,
            functionalityId: oldData.functionalityId,
            licenseEndDate: oldData.licenseEndDate,
            userLimit: oldData.userLimit,
            itemLimit: oldData.itemLimit,
            tableLimit: oldData.tableLimit,
            isEnabled: oldData.isEnabled,
            createdAt: oldData.createdAt
        }
        setUpdateLicenseData(_updateLicense);
        handleClickOpenUpdateLicense();
    }

    const handleLicenseRenewEdit = (oldData) => {
        const _updateLicense = {
            licenseId: oldData.licenseId,
            licenseType: oldData.licenseType,
            functionalityId: oldData.functionalityId,
            licenseEndDate: oldData.licenseEndDate,
            userLimit: oldData.userLimit,
            itemLimit: oldData.itemLimit
        }
        console.log(_updateLicense);
        setRenewLicenseData(_updateLicense);
        handleClickOpenRenewLicense();
    }

    const handleDeleteLicense = (id) => {
        if (window.confirm(`Delete License?`)) {
            ApiDelete('license' + `/${id}`).then((res) => {
                setRestaurant();
            }).catch((error) => {
                console.log(error.response.data.message)
            });
        }
    }

    const handleDeleteLicenseString = (id) => {
        if (window.confirm(`Delete License String?`)) {
            ApiDelete('licString' + `/${id}`).then((res) => {
                setRestaurant();
            }).catch((error) => {
                console.log(error.response.data.message)
            });
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Restaurant License</h1>

                <div className="mr-3">
                    <button className="add-user-btn" onClick={handleClickOpenAdd}>
                        <span className="material-icons">
                            add
                        </span>
                        Add Restuarant
                    </button>
                </div>
            </div>
            {/* <hr className="pageHeaderHr" /> */}
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>Restaurant License Information</h3>
                </div>
                <table className="user-table-content">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '35px' }}>Sr</th>
                            <th>Name</th>
                            <th style={{ width: '120px' }}>GST</th>
                            <th>Address</th>
                            <th style={{ width: '120px' }}>Contact No</th>
                            <th style={{ width: '100px' }}>Order Prefix</th>
                            <th style={{ width: '100px' }}>Main Username</th>
                            <th style={{ width: '80px' }}>Image</th>
                            <th style={{ width: '100px' }}>Enabled</th>
                            <th style={{ width: '100px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            restaurantList.map((restaurant, index) => {
                                return (
                                    <>
                                        <tr key={`1${restaurant._id}`} className="table-content mt-2 mb-2">
                                            <td >
                                                {index + 1}
                                            </td>
                                            <td>
                                                {restaurant.name}
                                            </td>
                                            <td>
                                                {restaurant.gstNo.toUpperCase()}
                                            </td>
                                            <td>
                                                {restaurant.address}
                                            </td>
                                            <td>
                                                {restaurant.contactNo}
                                            </td>
                                            <td>
                                                {restaurant.orderPrefix}
                                            </td>
                                            <td>
                                                {restaurant.mainUserName}
                                            </td>
                                            <td>
                                                <img className='rounded img-fluid mb-1'

                                                    src={process.env.REACT_APP_IMAGE_URL + restaurant.logo === "" ? "./images/Chef-restaurant.jpg" : process.env.REACT_APP_IMAGE_URL + restaurant.logo}

                                                    onError={(e) => { e.target.onerror = null; e.target.src = "./images/Chef-restaurant.jpg" }}

                                                    alt=""

                                                    width={60} />
                                            </td>
                                            <td >
                                                {restaurant.isEnabled ? "Active" : "Deactive"}
                                            </td>
                                            <td style={{ textAlign: 'left' }}>
                                                <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(restaurant) }}>Edit</button>
                                                <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDeleteLicense(restaurant._id) }}>Delete</button>
                                            </td>
                                        </tr>
                                        <tr key={`2${restaurant._id}`}>
                                            <td colSpan={10}>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Type</th>
                                                            <th>End Date</th>
                                                            <th>User Limit</th>
                                                            <th>Item Limit</th>
                                                            <th>Table Limit</th>
                                                            <th>Enabled</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            restaurant.licenseStrings.map((lstrings) => {
                                                                return (
                                                                    <tr key={lstrings._id}>
                                                                        <td>
                                                                            {lstrings.licenseType}
                                                                        </td>
                                                                        <td>
                                                                            {Helper.GetFormatedDate(lstrings.licenseEndDate, 'DD-MM-YYYY')}
                                                                        </td>
                                                                        <td>
                                                                            {lstrings.userLimit}
                                                                        </td>
                                                                        <td>
                                                                            {lstrings.itemLimit}
                                                                        </td>
                                                                        <td>
                                                                            {lstrings.tableLimit}
                                                                        </td>
                                                                        <td>
                                                                            {lstrings.isEnabled ? "Enabled" : "Disabled"}
                                                                        </td>
                                                                        <td style={{ textAlign: 'left' }}>
                                                                            <button className="diplayTableTwoEditBtn" onClick={(e) => { handleLicenseEdit(lstrings) }}>Edit</button>
                                                                            <button className="diplayTableTwoActtiveBtn" onClick={(e) => { handleLicenseRenewEdit(lstrings) }}>Renew</button>
                                                                            <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDeleteLicenseString(lstrings._id) }}>Delete</button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <div className="mt-2 mb-2"></div>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <AddRegisterRestaurant
                open={openAdd}
                handleClose={handleCloseAdd}
                data={restaurantData}
                functionalities={functionalityList}
                onChange={onChange}
                handleAddItem={handleAddItem}
                handleRemoveItem={handleRemoveItem}
                toggleCheckAll={toggleCheckAll}
                checkUsername={checkUsername}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
            <UpdateRegisterRestaurant
                open={openUpdate}
                handleClose={handleCloseUpdate}
                data={updateData}
                setRestaurant={setRestaurant}
            />
            <UpdateLicenseString
                open={openUpdateLicense}
                handleClose={handleCloseUpdateLicense}
                data={updateLicenseData}
                functionalities={functionalityList}
                setRestaurant={setRestaurant}
            />
            <RenewLicenseString
                open={openRenewLicense}
                handleClose={handleCloseRenewLicense}
                data={renewLicenseData}
                functionalities={functionalityList}
                setRestaurant={setRestaurant}
            />
        </>
    )
}

export default RegisterRestaurant