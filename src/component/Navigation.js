import React, { useContext, useState } from "react";
import { UserContext } from '../UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Profile from "./Profile";
import Swal from "sweetalert2";
import Helper from "../Helper";

const initialData = {
    password: "",
    repeat_password: ""
}

const Navigation = () => {
    const { setUser, menu, show, setShow, setMenuValue, user } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    let navigate = useNavigate();
    const viewUsers = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.USERS, Helper.CRUD.VIEW);
    const viewWaitingList = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.WAITING_LIST, Helper.CRUD.VIEW);
    const viewOpenOrders = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.ORDERS_OPEN_ORDERS, Helper.CRUD.VIEW);
    const viewOrderHistory = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.ORDERS_HISTORY, Helper.CRUD.VIEW);
    const viewInvoiceHistory = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.INVOICE_HISTORY, Helper.CRUD.VIEW);
    const viewGSTInvoice = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.GST_INVOICE, Helper.CRUD.VIEW);
    const viewCategory = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.MASTER_CATEGORY, Helper.CRUD.VIEW);
    const viewSubcategory = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.MASTER_SUBCATEGORY, Helper.CRUD.VIEW);
    const viewItem = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.MASTER_ITEM, Helper.CRUD.VIEW);
    const viewTable = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.MASTER_TABLE, Helper.CRUD.VIEW);
    const viewCustomer = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.MASTER_CUSTOMER, Helper.CRUD.VIEW);
    const viewFunctionality = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.ADMIN_MASTER_FUNCTIONALITY, Helper.CRUD.VIEW);
    const viewRole = Helper.hasFunctionality(user, Helper.FUNCTIONALITY.ADMIN_MASTER_ROLE, Helper.CRUD.VIEW);


    const handleClickOpen = () => {
        const _formData = { ...formData };
        _formData.name = user.userName
        setFormData(_formData);
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setFormData(initialData);
        setOpen(false);
    };

    const onChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
    }

    const handleFormSubmit = () => {
        setErrMsg('');
        axios.patch('user/p', formData).then((res) => {
            window.alert('Password Updated')
            handleClose();
        }).catch((error) => {
            setErrMsg(error.response.data.message)
        });
    }

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Are You Sure to Logout!',
            // imageUrl: '/images/login-img-4.png',
            // imageWidth: 250,
            // imageHeight: 250,
            // imageAlt: 'Logout Iamge',
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: 'Yes, Logout!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post('logout', { refresh_token: user.refresh_token }).then(res => {
                        setUser('');
                        navigate('/login');
                    })
                }
            })
    }

    return (
        <div>
            <div className="main-sidebar-design">
                <div className="profile-picture">
                    <img src='/images/logo.svg' alt="" />
                    <h3>Restaurant</h3>
                </div>
                <div className="sidebar-inner">
                    <div className="single-list-sidebar">
                        <button className="tab-button">
                            <span className="material-icons">
                                grid_view
                            </span>
                            <Link to="/" className="text-base leading-4">
                                Dashboard
                            </Link>
                        </button>
                    </div>
                    {
                        viewUsers ?
                            <div className="single-list-sidebar">
                                <button className="tab-button">
                                    <span className="material-icons">
                                        person_outline
                                    </span>
                                    <Link to="/user" className="text-base leading-4">
                                        Users
                                    </Link>
                                </button>
                            </div>
                            : ""
                    }
                    {
                        viewWaitingList ?
                            <div className="single-list-sidebar">
                                <button className="tab-button">
                                    <span className="material-icons">
                                        person_outline
                                    </span>
                                    <Link to="/wlist" className="text-base leading-4">
                                        Waiting List
                                    </Link>
                                </button>
                            </div>
                            : ""
                    }
                    {
                        (viewOpenOrders || viewOrderHistory) ?
                            <div className="single-list-sidebar">
                                <button className="tab-button justify-between" onClick={() => setMenuValue(0)}>
                                    <div className="flex  items-center">
                                        <span className="material-icons">
                                            list_alt
                                        </span>
                                        <p className="text-base leading-4">
                                            Orders
                                        </p>
                                    </div>
                                    <svg id="icon1" className={`${menu[0] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div id="menu1" className={`${menu[0] ? 'block' : 'hidden'} sub-menu-link`}>
                                    {
                                        viewOpenOrders ?
                                            <Link to="/oop" className="">
                                                <span className="material-icons mr-2">
                                                    copy_all
                                                </span>
                                                Open Orders
                                            </Link>
                                            : ""
                                    }
                                    {
                                        viewOrderHistory ?
                                            <Link to="/orders" className="">
                                                <span className="material-icons mr-2">
                                                    manage_search
                                                </span>
                                                Orders History
                                            </Link>
                                            : ""
                                    }
                                </div>
                            </div>
                            : ""
                    }
                    {
                        (viewInvoiceHistory || viewGSTInvoice) ?
                            <div className="single-list-sidebar">
                                <button className="tab-button justify-between" onClick={() => setMenuValue(1)}>
                                    <div className="flex  items-center">
                                        <span className="material-icons">
                                            price_check
                                        </span>
                                        <p className="text-base leading-4">
                                            Invoices
                                        </p>
                                    </div>
                                    <svg id="icon1" className={`${menu[1] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div id="menu1" className={`${menu[1] ? 'block' : 'hidden'} sub-menu-link`}>
                                    {
                                        viewInvoiceHistory ?
                                            <Link to="/ih" className="">
                                                <span className="material-icons mr-2">
                                                    currency_exchange
                                                </span>
                                                Invoice History
                                            </Link>
                                            : ""
                                    }
                                    {
                                        viewGSTInvoice ?
                                            <Link to="/gst" className="">
                                                <span className="material-icons mr-2">
                                                    toll
                                                </span>
                                                GST Invoices
                                            </Link>
                                            : ""
                                    }
                                </div>
                            </div>
                            : ""
                    }
                    {
                        (viewCategory || viewSubcategory || viewItem || viewTable || viewCustomer) ?
                            <div className="single-list-sidebar">
                                <button className="tab-button justify-between" onClick={() => setMenuValue(2)}>
                                    <div className="flex  items-center">
                                        <span className="material-icons">
                                            settings_input_antenna
                                        </span>
                                        <p className="text-base leading-4">
                                            Master
                                        </p>
                                    </div>
                                    <svg id="icon1" className={`${menu[2] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div id="menu1" className={`${menu[2] ? 'block' : 'hidden'} sub-menu-link`}>
                                    {
                                        viewCategory ?
                                            <Link to="/category" className="">
                                                <span className="material-icons mr-2">
                                                    checklist
                                                </span>
                                                Category
                                            </Link>
                                            : ""
                                    }
                                    {
                                        viewSubcategory ?
                                            <Link to="/subcategory" className="">
                                                <span className="material-icons mr-2">
                                                    format_list_numbered
                                                </span>
                                                Subcategory
                                            </Link>
                                            : ""
                                    }
                                    {
                                        viewItem ?
                                            <Link to="/item" className="">
                                                <span className="material-icons mr-2">
                                                    checklist_rtl
                                                </span>
                                                Item
                                            </Link>
                                            : ""
                                    }
                                    {
                                        viewTable ?
                                            <Link to="/table" className="">
                                                <span className="material-icons mr-2">
                                                    table_restaurant
                                                </span>
                                                Table
                                            </Link>
                                            : ""
                                    }
                                </div>
                            </div>
                            : ""
                    }
                    {
                        (viewFunctionality || viewRole) ?
                            <div className="single-list-sidebar">
                                <button className="tab-button justify-between" onClick={() => setMenuValue(3)}>
                                    <div className="flex  items-center">
                                        <span className="material-icons">
                                            dvr
                                        </span>
                                        <p className="text-base leading-4">
                                            Admin Master
                                        </p>
                                    </div>
                                    <svg id="icon1" className={`${menu[3] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div id="menu1" className={`${menu[3] ? 'block' : 'hidden'} sub-menu-link`}>
                                    {
                                        viewFunctionality ?
                                            <Link to="/functionality" className="">
                                                <span className="material-icons mr-2">
                                                    crop_rotate
                                                </span>
                                                Functionality
                                            </Link>
                                            : ""
                                    }
                                    {
                                        viewRole ?
                                            <Link to="/role" className="">
                                                <span className="material-icons mr-2">
                                                    supervised_user_circle
                                                </span>
                                                Role
                                            </Link>
                                            : ""
                                    }
                                </div>
                            </div>
                            : ""
                    }


                    <div className="profile-menu-footer">

                        <button className="profile-btn" onClick={handleClickOpen}>
                            <img src="https://www.business2community.com/wp-content/uploads/2014/04/profile-picture-300x300.jpg" alt="" />
                            <p className="">{user.userName}</p>
                            <p className="">{user.role}</p>
                        </button>
                        <button className="switch-account" onClick={handleLogout}>

                            <span className="material-icons">
                                power_settings_new
                            </span>
                        </button>
                    </div>
                </div>
                <div className=" flex justify-between items-center w-full py-4 px-6">
                    <div className="flex justify-center items-center space-x-2">
                        <div>
                            <svg width={34} height={34} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 17H0H1ZM7 17H6H7ZM17 27V28V27ZM27 17H28H27ZM17 0C12.4913 0 8.1673 1.79107 4.97918 4.97918L6.3934 6.3934C9.20644 3.58035 13.0218 2 17 2V0ZM4.97918 4.97918C1.79107 8.1673 0 12.4913 0 17H2C2 13.0218 3.58035 9.20644 6.3934 6.3934L4.97918 4.97918ZM0 17C0 21.5087 1.79107 25.8327 4.97918 29.0208L6.3934 27.6066C3.58035 24.7936 2 20.9782 2 17H0ZM4.97918 29.0208C8.1673 32.2089 12.4913 34 17 34V32C13.0218 32 9.20644 30.4196 6.3934 27.6066L4.97918 29.0208ZM17 34C21.5087 34 25.8327 32.2089 29.0208 29.0208L27.6066 27.6066C24.7936 30.4196 20.9782 32 17 32V34ZM29.0208 29.0208C32.2089 25.8327 34 21.5087 34 17H32C32 20.9782 30.4196 24.7936 27.6066 27.6066L29.0208 29.0208ZM34 17C34 12.4913 32.2089 8.1673 29.0208 4.97918L27.6066 6.3934C30.4196 9.20644 32 13.0218 32 17H34ZM29.0208 4.97918C25.8327 1.79107 21.5087 0 17 0V2C20.9782 2 24.7936 3.58035 27.6066 6.3934L29.0208 4.97918ZM17 6C14.0826 6 11.2847 7.15893 9.22183 9.22183L10.636 10.636C12.3239 8.94821 14.6131 8 17 8V6ZM9.22183 9.22183C7.15893 11.2847 6 14.0826 6 17H8C8 14.6131 8.94821 12.3239 10.636 10.636L9.22183 9.22183ZM6 17C6 19.9174 7.15893 22.7153 9.22183 24.7782L10.636 23.364C8.94821 21.6761 8 19.3869 8 17H6ZM9.22183 24.7782C11.2847 26.8411 14.0826 28 17 28V26C14.6131 26 12.3239 25.0518 10.636 23.364L9.22183 24.7782ZM17 28C19.9174 28 22.7153 26.8411 24.7782 24.7782L23.364 23.364C21.6761 25.0518 19.3869 26 17 26V28ZM24.7782 24.7782C26.8411 22.7153 28 19.9174 28 17H26C26 19.3869 25.0518 21.6761 23.364 23.364L24.7782 24.7782ZM28 17C28 14.0826 26.8411 11.2847 24.7782 9.22183L23.364 10.636C25.0518 12.3239 26 14.6131 26 17H28ZM24.7782 9.22183C22.7153 7.15893 19.9174 6 17 6V8C19.3869 8 21.6761 8.94821 23.364 10.636L24.7782 9.22183ZM10.3753 8.21913C6.86634 11.0263 4.86605 14.4281 4.50411 18.4095C4.14549 22.3543 5.40799 26.7295 8.13176 31.4961L9.86824 30.5039C7.25868 25.9371 6.18785 21.9791 6.49589 18.5905C6.80061 15.2386 8.46699 12.307 11.6247 9.78087L10.3753 8.21913ZM23.6247 25.7809C27.1294 22.9771 29.1332 19.6127 29.4958 15.6632C29.8549 11.7516 28.5904 7.41119 25.8682 2.64741L24.1318 3.63969C26.7429 8.20923 27.8117 12.1304 27.5042 15.4803C27.2001 18.7924 25.5372 21.6896 22.3753 24.2191L23.6247 25.7809Z" fill="white" />
                            </svg>
                        </div>
                        <div className="flex justify-start flex-col items-start">
                            <button className="focus:outline-none" onClick={handleClickOpen}>
                                <p className="cursor-pointer text-sm leading-5 text-white">{user.userName}</p>
                                <p className="cursor-pointer text-xs leading-3 text-gray-300">{user.role}</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Profile
                open={open}
                handleClose={handleClose}
                data={formData}
                name={user.userName}
                onChange={onChange}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
        </div>
    )
}

export default Navigation