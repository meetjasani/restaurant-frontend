import { useEffect, useState } from "react"
import AddUser from "./AddUser";
import Helper from "../../helper/Helper";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../helper/API/ApiData";

const initialData = {
    name: "",
    mobileNumber: "",
    roleId: "",
    isEnabled: true
}

const Users = () => {
    const [open, setOpen] = useState(false);
    const [data, SetData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    let history = useHistory();
    const url = 'user';
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

    const setRolesData = () => {
        ApiGet('role/l').then((res) => {
            setRoles(res);
        }).catch((err) => console.log(err))
    }

    const setUserData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.USERS, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.USERS, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.USERS, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.USERS, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setRolesData();
        setUserData();
    }, [userData])

    const onChange = (e) => {
        const _formData = { ...formData };
        if (e.target.id === 'isEnabled') {
            _formData[e.target.id] = e.target.checked;
            setFormData(_formData);
            return;
        }
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
        // console.log(_formData);
    }

    const handleFormSubmit = () => {

        setErrMsg('');
        let errMsg = [];
        if (formData.name === "") {
            errMsg.push('Name');
        }

        if (formData.mobileNumber === "") {
            errMsg.push('Mobile Number');
        }

        if (formData.roleId === "") {
            errMsg.push('Role');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        // const userData = {
        //     _id: formData._id,
        //     name: formData.name,
        //     mobileNumber: formData.mobileNumber,
        //     roleId: "6209ed904a21b01002bc2827",
        //     isEnabled: formData.isEnabled
        // }

        if (formData._id) {
            ApiPatch(url, formData).then((res) => {
                handleClose();
                setUserData();
            }).catch((error) => { setErrMsg(error.response.data.message) })

        } else {

            ApiPost('register', formData).then((res) => {
                handleClose();
                setUserData();
            }).catch((error) => { setErrMsg(error.response.data.message) })
        }
    }

    const handleToggleEnable = (id, status) => {
        Swal.fire({
            title: (`${status} User`),
            text: (`Are You Sure to ${status} User ?`),
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: (`${status} User`)
        })
            .then((result) => {
                if (result.isConfirmed) {
                    ApiDelete(url + `/${id}`, formData).then((res) => {
                        setUserData();
                    }).catch((error) => {
                        console.log(error.response.data.message)
                    });
                }
            })
    }

    const handleEdit = (oldData) => {
        setFormData(oldData);
        setOpen(true);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">User</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-3">
                            <button className="add-user-btn" onClick={handleClickOpen}>
                                <span className="material-icons">
                                    add
                                </span>
                                Add User
                            </button>
                        </div>
                        :
                        ""
                }

            </div>
            {/* <hr className="pageHeaderHr" /> */}
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>User Information</h3>
                </div>
                <table className="user-table-content">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '40px', minWidth: '40px' }}>Sr</th>
                            <th style={{ width: '150px', minWidth: '150px' }}>Name</th>
                            <th style={{ width: '200px', minWidth: '200px' }}>User Name</th>
                            <th style={{ width: '220px', minWidth: '220px' }}>Mobile Number</th>
                            <th style={{ width: '200px', minWidth: '200px' }}>Role</th>
                            <th style={{ width: '220px', minWidth: '220px' }}>User Status</th>
                            <th style={{ width: '100px', minWidth: '100px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((user, index) => {
                                return (
                                    <tr key={user._id} className="table-content">
                                        <td >
                                            {index + 1}
                                        </td>
                                        <td style={{ textTransform: 'uppercase' }}>
                                            {user.name}
                                        </td>
                                        <td>
                                            {user.username}
                                        </td>
                                        <td>
                                            {user.mobileNumber}
                                        </td>
                                        <td style={{ textTransform: 'uppercase' }}>
                                            {user.roleId !== undefined ? Helper.GetLabelFromValue(roles, user.roleId) : ""}
                                        </td>
                                        <td >
                                            {user.isEnabled ? "Active" : "Deactive"}
                                        </td>
                                        <td>
                                            {
                                                rightsData.canUpdate ?
                                                    <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(user) }}>Edit</button>
                                                    :
                                                    ""
                                            }
                                            {
                                                rightsData.canDelete ?
                                                    <button className={user.isEnabled ? "diplayTableTwoDeleteBtn" : "diplayTableTwoActtiveBtn"} onClick={(e) => { handleToggleEnable(user._id, e.target.outerText) }}>{user.isEnabled ? "Deactive" : "Active"}</button>
                                                    :
                                                    ""
                                            }

                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <AddUser
                open={open}
                handleClose={handleClose}
                data={formData}
                onChange={onChange}
                roles={roles}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
        </>
    )
}

export default Users