import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import AddSubcategory from "./AddSubcategory";
import Helper from "../../../helper/Helper";

const initialData = {
    name: "",
    description: "",
}

const Subcategory = () => {
    const [open, setOpen] = useState(false);
    const [data, SetData] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const url = 'subcategory';

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

    const setSubCategoryData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        })
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_SUBCATEGORY, Helper.CRUD.VIEW)) {
                history.push("/");
            }
        }
        const _rightsData = { ...rightsData }
        _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_SUBCATEGORY, Helper.CRUD.INSERT);
        _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_SUBCATEGORY, Helper.CRUD.UPDATE);
        _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_SUBCATEGORY, Helper.CRUD.DELETE);
        setRightsData(_rightsData);
        setSubCategoryData();
    }, [userData])

    const onChange = (e) => {
        // console.log(e.target.value);
        const _formData = { ...formData };
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
    }

    const handleFormSubmit = () => {
        setErrMsg('');
        let errMsg = [];
        if (formData.name === "") {
            errMsg.push('Subcategory name');
        }

        if (formData.categoryId === "") {
            errMsg.push('Category');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        if (formData._id) {
            ApiPatch(url, formData).then((res) => {
                handleClose();
                setSubCategoryData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost(url, formData).then((res) => {
                setSubCategoryData();
                handleClose();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

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
                        setSubCategoryData();
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
        _formData.categoryId = oldData.categoryId._id;
        _formData.description = oldData.description;
        setFormData(_formData);
        setOpen(true);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Subcategory</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-3">
                            <button className="add-user-btn pc-adduser-btn" onClick={handleClickOpen}>
                                <span className="material-icons">
                                    add
                                </span>
                                Subcategory
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
                            <th style={{ width: '40px', minWidth:'40px' }}>Sr</th>
                            <th style={{ width: '140px', minWidth:'140px'  }}>Name</th>
                            <th style={{ width: '210px', minWidth:'210px'  }}>Description</th>
                            <th style={{ width: '100px', minWidth:'100px'  }}>User</th>
                            <th style={{ width: '200px', minWidth:'200px'  }}>Updated Date/Time</th>
                            <th style={{ width: '100px', minWidth:'40px'  }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((category, index) => {
                                return (
                                    <>
                                        <div className="mt-2 mb-2"></div>
                                        <tr key={category._id} className="table-content">
                                            <td >
                                                {index + 1}
                                            </td>
                                            <td>
                                                {category.name}
                                            </td>
                                            <td>
                                                {category.description}
                                            </td>
                                            <td>
                                                {category.userId.name}
                                            </td>
                                            <td >
                                                {Helper.GetFormatedDate(category.updatedAt, 'DD-MM-YYYY hh:mm A')}
                                            </td>
                                            <td>
                                                {
                                                    rightsData.canUpdate ?
                                                        <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(category) }}>Edit</button>
                                                        : ""
                                                }
                                                {
                                                    rightsData.canDelete ?
                                                        <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(category._id) }}>Delete</button>
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
            <AddSubcategory
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

export default Subcategory