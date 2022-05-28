import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import Helper from "../../../helper/Helper";
import AddCategory from "./AddCategory";

const initialData = {
    name: "",
    description: "",
}

const Category = () => {
    const [open, setOpen] = useState(false);
    const [data, SetData] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const url = 'category';

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

    const setCategoryData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        })
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CATEGORY, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CATEGORY, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CATEGORY, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CATEGORY, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setCategoryData();
    }, [userData])

    const onChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
    }

    const handleFormSubmit = () => {
        setErrMsg('');

        if (formData.name === "") {
            setErrMsg("Enter category name");
            return;
        }

        if (formData._id) {
            ApiPatch(url, formData).then((res) => {
                handleClose();
                setCategoryData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost(url, formData).then((res) => {
                setCategoryData();
                handleClose();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    // const handleDelete = (id) => {
    //     if (window.confirm("Delete Category?")) {
    //         axios.delete(url + `/${id}`, formData).then((res) => {
    //             setCategoryData();
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
                        setCategoryData();
                    }).catch((error) => {
                        Swal.fire({

                            text: (error.response.data.message),

                        })

                        // window.alert(error.response.data.message)
                    });
                }
            })
    }


    const handleEdit = (oldData) => {
        const _formData = { ...formData };
        _formData['_id'] = oldData._id;
        _formData.name = oldData.name;
        _formData.description = oldData.description;
        setFormData(_formData);
        setOpen(true);
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Category</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-3">
                            <button className="add-user-btn" onClick={handleClickOpen}>
                                <span className="material-icons">
                                    add
                                </span>
                                Category
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
                            <th style={{ width: '170px', minWidth:'170px' }}>Description</th>
                            <th style={{ width: '120px', minWidth:'120px' }}>User</th>
                            <th style={{ width: '200px', minWidth:'200px' }}>Updated Date/Time</th>
                            <th style={{ width: '100px' , minWidth:'100px'}}></th>
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
                                            <td style={{ textAlign: 'left' }}>
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
            <AddCategory
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

export default Category