import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import Helper from "../../../helper/Helper";
import AddCustomer from "./AddCustomer";

const initialData = {
    name: "",
    contactNumber: "",
    gstNumber: "",
}

const Customer = () => {
    const [open, setOpen] = useState(false);
    const [data, SetData] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const url = 'customer';

    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setFormData(initialData);
        setOpen(false);
    };

    const setCustomerData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        })
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CUSTOMER, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CUSTOMER, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CUSTOMER, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CUSTOMER, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setCustomerData();
    }, [userData])

    const onChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
    }

    const handleFormSubmit = () => {
        setErrMsg('');

        if (formData.name === "") {
            setErrMsg("Enter Customer name");
            return;
        }

        if (formData._id) {
            ApiPatch(url, formData).then((res) => {
                if (res !== undefined) {
                    handleClose();
                    setCustomerData();
                }
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost(url, formData).then((res) => {
                if (res !== undefined) {
                    setCustomerData();
                    handleClose();
                }
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    // const handleDelete = (id) => {
    //     if (window.confirm("Delete Customer?")) {
    //         axios.delete(url + `/${id}`, formData).then((res) => {
    //             setCustomerData();
    //         }).catch((error) => {
    //             window.alert(error.response.data.message)
    //         });
    //     }
    // }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Catagory",
            text: "Are You Sure to Delete a Catagory",
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: "Delete"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    ApiDelete(url + `/${id}`, formData).then((res) => {
                    }).catch((error) => {
                        Swal.fire({
                            text: (error.response.data.message),
                        })
                    });
                }
            })
    }

    const handleEdit = (oldData) => {
        const _formData = { ...formData };
        _formData['_id'] = oldData._id;
        _formData.name = oldData.name;
        _formData.contactNumber = oldData.contactNumber;
        _formData.gstNumber = oldData.gstNumber;
        setFormData(_formData);
        setOpen(true);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Customer</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-3">
                            <button className="add-user-btn" onClick={handleClickOpen}>
                                <span className="material-icons">
                                    add
                                </span>
                                Customers
                            </button>
                        </div>
                        :
                        ""
                }
            </div>
            {/* <hr className="pageHeaderHr" /> */}
            <div className="diplayTable-custom p-4">
                <table >
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '40px',minWidth:'40px' }}>Sr</th>
                            <th style={{ width: '100px',minWidth:'100px' }}>Name</th>
                            <th style={{ width: '160px',minWidth:'160px' }}>Contact Number</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>GST Number</th>
                            <th style={{ width: '100px',minWidth:'100px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((customer, index) => {
                                return (
                                    <>
                                        <div className="mt-2 mb-2"></div>
                                        <tr key={customer._id} className="table-content">
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {customer.name}
                                            </td>
                                            <td>
                                                {customer.contactNumber}
                                            </td>
                                            <td>
                                                {customer.gstNumber.toUpperCase()}
                                            </td>
                                            <td>
                                                {
                                                    rightsData.canUpdate ?
                                                        <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(customer) }}>Edit</button>
                                                        : ""
                                                }
                                                {
                                                    rightsData.canDelete ?
                                                        <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(customer._id) }}>Delete</button>
                                                        : ""
                                                }
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
            <AddCustomer
                open={open}
                handleClose={handleClose}
                data={formData}
                onChange={onChange}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
        </>
    )
}

export default Customer