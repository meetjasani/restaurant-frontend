import { useEffect, useState } from 'react';
import _ from 'lodash'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import Helper from "../../../helper/Helper";
import AddRole from './AddRole';

const initialData = {
    _id: "",
    name: "",
    description: "",
    rights: [
        // {
        //     functionalityId: "",
        //     canView: false,
        //     canInsert: false,
        //     canUpdate: false,
        //     canDelete: false,
        // }
    ],
    isEnabled: true,
}

const Role = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [functionalities, setFunctionalities] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const url = 'role';

    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        const _formData = { ...formData };
        _formData._id = "";
        _formData.name = "";
        _formData.description = "";
        _formData.isEnabled = "";
        _formData.rights.map(right => {
            right.canView = false;
            right.canInsert = false;
            right.canUpdate = false;
            right.canDelete = false;
        })
        setFormData(JSON.parse(JSON.stringify(_formData)));
        setOpen(false);
    };

    const setRoleData = () => {
        ApiGet(url).then((res) => {
            setData(res);
        }).catch((err) => console.log(err))
    }

    const setfunctionalitiesData = () => {
        ApiGet('functionality/l').then((res) => {
            setFunctionalities(res);
            const _formData = { ...formData };
            _formData.rights = [];
            for (const right of res) {
                const func = {
                    functionalityId: right._id,
                    canView: false,
                    canInsert: false,
                    canUpdate: false,
                    canDelete: false,
                }
                _formData.rights.push(func);
            }
            setFormData(_formData);
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ADMIN_MASTER_ROLE, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ADMIN_MASTER_ROLE, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ADMIN_MASTER_ROLE, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ADMIN_MASTER_ROLE, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setfunctionalitiesData();
        setRoleData();
    }, [userData])

    const onChange = (e) => {
        const type = e.target.id.split('-')[0];
        const id = type === 'sub' ? e.target.id.split('-')[1] : type;
        const subId = type === 'sub' ? e.target.id.split('-')[2] : "";
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        // console.log(e.target.id);
        // console.log(type, '-', id, '-', subId);

        const _formData = { ...formData };

        if (type === 'sub') {
            _formData.rights.map((right) => {
                if (right.functionalityId === id) {
                    right[subId] = value;
                }
            })
            setFormData(_formData);
            // console.log(_formData);
        } else {
            _formData[id] = value;
            setFormData(_formData);
        }
    }

    const toggleAllHorizontal = (e) => {
        // console.log(e.target.id);
        const id = e.target.id;
        const checked = e.target.checked;
        const _formData = { ...formData };
        _formData.rights.map(right => {
            if (right.functionalityId === id) {
                const func = functionalities.filter(res => res._id === id)[0]
                right.canView = checked && func.view ? true : false;
                right.canInsert = checked && func.insert ? true : false;
                right.canUpdate = checked && func.update ? true : false;
                right.canDelete = checked && func.drop ? true : false;
                // console.log(func);
            }
        })
        setFormData(_formData);
        // console.log(_formData);
    }

    const toggleAllVerticle = (e) => {
        const id = e.target.id;
        const checked = e.target.checked;
        const _formData = { ...formData };
        _formData.rights.map(right => {
            const func = functionalities.filter(res => res._id === right.functionalityId)[0]
            if (id === "canView") { right.canView = checked && func.view ? true : false };
            if (id === "canInsert") { right.canInsert = checked && func.insert ? true : false };
            if (id === "canUpdate") { right.canUpdate = checked && func.update ? true : false };
            if (id === "canDelete") { right.canDelete = checked && func.drop ? true : false };
        })
        setFormData(_formData);
        // console.log(_formData);
    }

    const handleFormSubmit = () => {

        setErrMsg('');
        if (formData.name === "") {
            setErrMsg('Enter Name');
            return;
        }

        if (formData._id) {
            ApiPatch(url, formData).then((res) => {
                handleClose();
                setRoleData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost(url, formData).then((res) => {
                setRoleData();
                handleClose();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    const handleEdit = (oldData) => {
        const data = {
            _id: oldData._id,
            name: oldData.name,
            description: oldData.description,
            rights: [
                // {
                //     functionalityId: "",
                //     canView: false,
                //     canInsert: false,
                //     canUpdate: false,
                //     canDelete: false,
                // }
            ],
            isEnabled: oldData.isEnabled,
        }
        oldData.rights.map(right => {
            data.rights.push(
                {
                    functionalityId: right.functionalityId._id,
                    canView: right.canView,
                    canInsert: right.canInsert,
                    canUpdate: right.canUpdate,
                    canDelete: right.canDelete,
                }
            )
        })

        functionalities.map(func => {
            const index = data.rights.findIndex(right => right.functionalityId === func._id)
            if (index < 0) {
                data.rights.push(
                    {
                        functionalityId: func._id,
                        canView: false,
                        canInsert: false,
                        canUpdate: false,
                        canDelete: false,
                    }
                )
            }
        })

        setFormData(JSON.parse(JSON.stringify(data)));
        setOpen(true);
    }

    const handleDelete = (id) => {
        if (window.confirm('Delete Role?')) {
            ApiDelete(url + `/${id}`, formData).then((res) => {
                setRoleData();
            }).catch((error) => {
                console.log(error.response.data.message)
            });
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Roles</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-1">
                            <button className="focus:outline-none" onClick={handleClickOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="#191f2c" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                                </svg>
                            </button>
                        </div>
                        : ""
                }
            </div>
            {/* <hr className="pageHeaderHr" /> */}
            <table className="diplayTable w-full">
                <thead>
                    <tr>
                        <th style={{ width: '40px',minWidth:'40px' }}>Sr</th>
                        <th style={{ width: '200px',minWidth:'40px'  }}>Name</th>
                        <th>Functionality</th>
                        <th style={{ width: '100px' }}>View</th>
                        <th style={{ width: '100px' }}>Insert</th>
                        <th style={{ width: '100px' }}>Update</th>
                        <th style={{ width: '100px' }}>Drop</th>
                        <th style={{ width: '100px' }}>Enabled</th>
                        <th style={{ width: '100px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((role, index) => {
                            return (
                                <tr key={'main' + role._id}>
                                    <td style={{ textAlign: 'center' }}>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {role.name}
                                    </td>
                                    <td colSpan={5}>
                                        <table style={{ width: '100%' }}>
                                            <tbody>
                                                {
                                                    _.orderBy(role.rights, item => item.functionalityId.name, ['asc']).map((right) => {
                                                        return (
                                                            <tr key={'sub' + right._id}>
                                                                <td style={{ border: '0px' }}>
                                                                    {/* {right ? Helper.setComboboxValue(functionalities, right.functionalityId)[0].label : ""} */}
                                                                    {right.functionalityId.name}
                                                                </td>
                                                                <td style={{ width: '100px', border: '0px', textAlign: 'center' }}>
                                                                    {right.canView ? "View" : ""}
                                                                </td>
                                                                <td style={{ width: '100px', border: '0px', textAlign: 'center' }}>
                                                                    {right.canInsert ? "Insert" : ""}
                                                                </td>
                                                                <td style={{ width: '100px', border: '0px', textAlign: 'center' }}>
                                                                    {right.canUpdate ? "Update" : ""}
                                                                </td>
                                                                <td style={{ width: '100px', border: '0px', textAlign: 'center' }}>
                                                                    {right.canDelete ? "Delete" : ""}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {role.isEnabled ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {
                                            rightsData.canUpdate ?
                                                <button className="diplayTableEditBtn" onClick={(e) => { handleEdit(role) }}>Edit</button>
                                                : ""
                                        }
                                        {
                                            rightsData.canDelete ?
                                                <button className="diplayTableDeleteBtn" onClick={(e) => { handleDelete(role._id) }}>Delete</button>
                                                : ""
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <AddRole
                open={open}
                handleClose={handleClose}
                data={formData}
                functionalities={functionalities}
                onChange={onChange}
                toggleAllHorizontal={toggleAllHorizontal}
                toggleAllVerticle={toggleAllVerticle}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
        </>
    )
}

export default Role