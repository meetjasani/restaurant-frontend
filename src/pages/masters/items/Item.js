import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import Helper from "../../../helper/Helper";
import AddItem from "./AddItem";

const initialData = {
    name: "",
    categoryId: "",
    subCategoryId: "",
    price: 0,
    description: "",
    itemImg: "",
    isAvailable: true
}

const Item = () => {
    const [open, setOpen] = useState(false);
    const [data, SetData] = useState([]);
    const [categories, SetCategories] = useState([]);
    const [subCategories, SetSubCategories] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [picture, setPicture] = useState({});
    const [errMsg, setErrMsg] = useState("");
    const url = 'item';

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
        ApiGet('subcategory/l').then((res) => {
            SetSubCategories(res);
        })
        ApiGet('category/l').then((res) => {
            SetCategories(res);
        })
    }

    const setItemData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        })
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_ITEM, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_ITEM, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_ITEM, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_ITEM, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setItemData();
        setSubCategoryData();
    }, [userData])

    const onChange = (e) => {
        const _formData = { ...formData };
        if (e.target.id === 'isAvailable') {
            _formData[e.target.id] = e.target.checked;
            setFormData(_formData);
            return;
        }
        if (e.target.id === 'itemImg') {
            setPicture(e.target.files[0]);
            return;
        }
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
    }

    const handleFormSubmit = () => {
        setErrMsg('');
        let errMsg = [];
        if (formData.name === "") {
            errMsg.push('Item name');
        }

        if (formData.subCategoryId === "") {
            errMsg.push('Subcategory');
        }

        if (formData.price === "") {
            errMsg.push('Price');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.toString()}`);
            return;
        }

        const fd = new FormData();

        // fd.append('test','hi')
        for (var key in formData) {
            fd.append(key, formData[key]);
        }
        fd.append('itemImg', picture);

        //View Formdata
        // for (var key of fd.entries()) {
        //     console.log(key[0] + ', ' + key[1]);
        // }

        if (formData._id) {
            ApiPatch(url, fd).then((res) => {
                handleClose();
                setItemData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost(url, fd).then((res) => {
                setItemData();
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
        _formData.subCategoryId = oldData.subCategoryId;
        _formData.price = oldData.price;
        _formData.description = oldData.description;
        _formData.isAvailable = oldData.isAvailable;
        setFormData(_formData);
        setOpen(true);
    }


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Item</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-3">
                            <button className="add-user-btn" onClick={handleClickOpen}>
                                <span className="material-icons">
                                    add
                                </span>
                                Items
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
                            <th style={{ width: '150px', minWidth:'150px' }}>Name</th>
                            <th style={{ width: '200px', minWidth:'200px' }}>Subcategory</th>
                            <th style={{ width: '200px', minWidth:'200px' }}>Category</th>
                            <th style={{ width: '100px', minWidth:'100px' }}>Price</th>
                            <th style={{ width: '200px', minWidth:'200px' }}>Description</th>
                            <th style={{ width: '100px' , minWidth:'100px'}}>Available</th>
                            <th style={{ width: '100px', minWidth:'100px' }}>User</th>
                            <th style={{ width: '200px', minWidth:'200px' }}>Updated Date/Time</th>
                            <th style={{ width: '100px' , minWidth:'100px'}}></th>
                        </tr>
                    </thead>
                    <tbody> 
                        {
                            data.map((row, index) => {
                                return (
                                    <tr key={row._id} className="table-content">
                                        <td >
                                            {index + 1}
                                        </td>
                                        <td>
                                            {row.name}
                                        </td>
                                        <td>
                                            {row.subCategoryName}
                                        </td>
                                        <td>
                                            {row.categoryName}
                                        </td>
                                        <td >
                                            {Helper.GetFormatedAmount(row.price)}
                                        </td>
                                        <td>
                                            {row.description}
                                        </td>
                                        <td>
                                            {row.isAvailable.toString()}
                                        </td>
                                        <td>
                                            {row.userName}
                                        </td>
                                        <td >
                                            {Helper.GetFormatedDate(row.updatedAt, 'DD-MM-YYYY hh:mm A')}
                                        </td>
                                        <td >
                                            {
                                                rightsData.canUpdate ?
                                                    <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(row) }}>Edit</button>
                                                    : ''
                                            }
                                            {
                                                rightsData.canDelete ?
                                                    <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(row._id) }}>Delete</button>
                                                    : ''
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <AddItem
                open={open}
                handleClose={handleClose}
                data={formData}
                categories={categories}
                subCategories={subCategories}
                onChange={onChange}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
        </>
    )
}

export default Item