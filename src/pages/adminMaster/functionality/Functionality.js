import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import Helper from "../../../helper/Helper";
import AddFunctionality from './AddFunctionality';

const initialData = {
    _id: "",
    name: "",
    description: "",
    view: false,
    insert: false,
    update: false,
    drop: false,
    isEnabled: true,
}

const Functionality = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const url = 'functionality';

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setFormData(initialData);
        setOpen(false);
    };

    const setFunctionalityData = () => {
        ApiGet(url).then((res) => {
            setData(res);
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        setFunctionalityData();
    }, [])

    const onChange = (e) => {
        // console.log(e.target.checked);
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const _formData = { ...formData };
        _formData[e.target.id] = value;
        setFormData(_formData);
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
                setFunctionalityData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {

            ApiPost(url, formData).then((res) => {
                setFunctionalityData();
                handleClose();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    const handleEdit = (oldData) => {
        setFormData(oldData);
        setOpen(true);
    }

    const handleDelete = (id) => {
        if (window.confirm('Delete Functionality?')) {
            ApiDelete(url + `/${id}`, formData).then((res) => {
                setFunctionalityData();
            }).catch((error) => {
                console.log(error.response.data.message)
            });
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Functionalities</h1>
                <div className="mr-3">
                    <button className="focus:outline-none" onClick={handleClickOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#191f2c" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                        </svg>
                    </button>
                </div>
            </div>
            <hr className="pageHeaderHr" />
            <table className="diplayTable w-full">
                <thead>
                    <tr>
                        <th style={{ width: '35px' }}>Sr</th>
                        <th style={{ width: '200px' }}>Name</th>
                        <th>Description</th>
                        <th style={{ width: '100px' }}>View</th>
                        <th style={{ width: '100px' }}>Insert</th>
                        <th style={{ width: '100px' }}>Update</th>
                        <th style={{ width: '100px' }}>Drop</th>
                        <th style={{ width: '100px' }}>Enabled</th>
                        <th style={{ width: '100px' }}>Default</th>
                        <th style={{ width: '100px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((func, index) => {
                            return (
                                <tr key={func._id}>
                                    <td style={{ textAlign: 'center' }}>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {func.name}
                                    </td>
                                    <td>
                                        {func.description}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {func.view ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {func.insert ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {func.update ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {func.drop ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {func.isEnabled ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {func.isDefault ? "TRUE" : "FALSE"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="diplayTableEditBtn" onClick={(e) => { handleEdit(func) }}>Edit</button>
                                        <button className="diplayTableDeleteBtn" onClick={(e) => { handleDelete(func._id) }}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <AddFunctionality
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

export default Functionality