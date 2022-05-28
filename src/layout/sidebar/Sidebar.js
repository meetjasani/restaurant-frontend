import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import Helper from '../../helper/Helper';
import Profile from '../../component/Profile';
import { ApiPatch } from "../../helper/API/ApiData";
import AuthStorage from '../../helper/AuthStorage';
import { changeLoginState } from '../../redux/actions/loginAction';
import { SocketContext } from '../../SocketContext';

const initialData = {
    password: "",
    repeat_password: ""
}
const AddCategory = ({ open, handleClose, data, onChange, handleFormSubmit, errMsg }) => {

}


const Sidebar = ({ siderbar, setSiderbar }) => {
    console.log("siderbar", siderbar);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [roleData, setRoleData] = useState({})
    const [errMsg, setErrMsg] = useState("");
    const [userDetails, setUserDetails] = useState();
    const [serverMsg, setServerMsg] = useState({ event: "", message: "" });
    let history = useHistory();
    let dispatch = useDispatch();
    // debugger;
    const { userData } = useSelector((state) => state.userData);
    const { is_toggleMenu } = useSelector(
        (state) => state.menuToggle
    );

    const sidebarClass = is_toggleMenu ? "block" : "none";
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (serverMsg.user_id === AuthStorage.getUserId()) {
            // console.log(serverMsg);
            // console.log(userDetails);
            logout();
        }
    }, [serverMsg])

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            // console.log('connected: ');
            socket.on("logout", (data) => { setServerMsg(data); })
        });
        return () => socket.disconnect();
    }, [])

    //For Sidebar menu (no close on page change)
    let menuArray = [false, false, false, false, false];
    const [menu, setMenu] = useState(menuArray);
    const setMenuValue = (props) => {
        let newArr = [...menu];
        newArr[props] = !newArr[props];
        // console.log(newArr);
        setMenu(newArr);
    }

    useEffect(() => {
        if (userData) {
            setUserDetails(userData)
            setRoleData({
                viewUsers: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.USERS, Helper.CRUD.VIEW),
                viewMenu: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.USERS, Helper.CRUD.VIEW),
                viewWaitingList: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST, Helper.CRUD.VIEW),
                viewWaitingListHistory: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST_HISTORY, Helper.CRUD.VIEW),
                viewOpenOrders: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_OPEN_ORDERS, Helper.CRUD.VIEW),
                viewOrderHistory: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_HISTORY, Helper.CRUD.VIEW),
                viewPickOrder: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.PICK_ORDER, Helper.CRUD.VIEW),
                viewInvoiceHistory: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.INVOICE_HISTORY, Helper.CRUD.VIEW),
                viewGSTInvoice: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.GST_INVOICE, Helper.CRUD.VIEW),
                viewCategory: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CATEGORY, Helper.CRUD.VIEW),
                viewSubcategory: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_SUBCATEGORY, Helper.CRUD.VIEW),
                viewItem: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_ITEM, Helper.CRUD.VIEW),
                viewTable: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_TABLE, Helper.CRUD.VIEW),
                viewCustomer: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_CUSTOMER, Helper.CRUD.VIEW),
                viewRole: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ADMIN_MASTER_ROLE, Helper.CRUD.VIEW),
                viewSetting: Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.SETTING, Helper.CRUD.VIEW),
            })
        }

    }, [userData])

    const handleClickOpen = () => {
        const _formData = { ...formData };
        _formData.name = userData.name
        setFormData(_formData);
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setSiderbar(false)
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
        ApiPatch('user/p', formData).then((res) => {
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
                    logout();
                }
            })
    }

    const logout = () => {
        AuthStorage.deauthenticateUser();
        dispatch(changeLoginState(false));
        history.push("/");
    }

    return (


        <div style={{ display: sidebarClass }}>



            <div className="main-sidebar-design sec-main-sidebar" >
                <>

                   
                        <div className="profile-picture">
                            <img
                                src={process.env.REACT_APP_IMAGE_URL + userData?.license.logo === "" ? "/images/logo.svg" : process.env.REACT_APP_IMAGE_URL + userData?.license.logo}
                                onError={(e) => { e.target.onerror = null; e.target.src = "/images/logo.svg" }}
                                alt="" />
                            <h3>{userData?.license.name}</h3>

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
                                roleData.viewUsers ?
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
                                roleData.viewMenu ?
                                    <div className='single-list-sidebar'>
                                        <button className='tab-button'>
                                            <span className="material-icons">
                                                restaurant_menu
                                            </span>
                                            <Link to="/menu" className='text-base leading-4'>
                                                Menu
                                            </Link>
                                        </button>
                                    </div>
                                    : ""
                            }
                            {
                                (roleData.viewWaitingList || roleData.viewWaitingListHistory) ?
                                    <div className="single-list-sidebar">
                                        <button className="tab-button justify-between" onClick={() => setMenuValue(5)}>
                                            <div className="flex  items-center">
                                                <span className="material-icons">
                                                    watch_later
                                                </span>
                                                <p className="text-base leading-4">
                                                    Waiting List
                                                </p>
                                            </div>
                                            <svg id="icon1" className={`${menu[5] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <div id="menu1" className={`${menu[5] ? 'block' : 'hidden'} sub-menu-link`}>
                                            {
                                                roleData.viewWaitingList ?
                                                    <Link to="/wlist" className="">
                                                        <span className="material-icons mr-2">
                                                            group
                                                        </span>
                                                        Waiting List
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewWaitingListHistory ?
                                                    <Link to="/wlisth" className="">
                                                        <span className="material-icons mr-2">
                                                            manage_search
                                                        </span>
                                                        Waiting List History
                                                    </Link>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                    : ""
                            }

                            {
                                (roleData.viewOpenOrders || roleData.viewOrderHistory || roleData.viewPickOrder) ?
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
                                                roleData.viewOpenOrders ?
                                                    <Link to="/oop" className="">
                                                        <span className="material-icons mr-2">
                                                            copy_all
                                                        </span>
                                                        Open Dine-in Orders
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewOpenOrders ?
                                                    <Link to="/tastatus" className="">
                                                        <span className="material-icons mr-2">
                                                            copy_all
                                                        </span>
                                                        Take-Away Status
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewPickOrder ?
                                                    <Link to="/pickorder" className="">
                                                        <span className="material-icons mr-2">
                                                            front_hand
                                                        </span>
                                                        Pick Order
                                                    </Link>
                                                    : ""
                                            }
                                            <Link to="/takeaway" className="">
                                                <span className="material-icons mr-2">
                                                    takeout_dining
                                                </span>
                                                Take Away Order
                                            </Link>
                                            {
                                                roleData.viewOrderHistory ?
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
                                (roleData.viewInvoiceHistory || roleData.viewGSTInvoice) ?
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
                                                roleData.viewInvoiceHistory ?
                                                    <Link to="/ih" className="">
                                                        <span className="material-icons mr-2">
                                                            currency_exchange
                                                        </span>
                                                        Invoice History
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewGSTInvoice ?
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
                                (roleData.viewCategory || roleData.viewSubcategory || roleData.viewItem || roleData.viewTable || roleData.viewCustomer) ?
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
                                                roleData.viewCategory ?
                                                    <Link to="/category" className="">
                                                        <span className="material-icons mr-2">
                                                            checklist
                                                        </span>
                                                        Category
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewSubcategory ?
                                                    <Link to="/subcategory" className="">
                                                        <span className="material-icons mr-2">
                                                            format_list_numbered
                                                        </span>
                                                        Subcategory
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewItem ?
                                                    <Link to="/item" className="">
                                                        <span className="material-icons mr-2">
                                                            checklist_rtl
                                                        </span>
                                                        Item
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewTable ?
                                                    <Link to="/table" className="">
                                                        <span className="material-icons mr-2">
                                                            table_restaurant
                                                        </span>
                                                        Table
                                                    </Link>
                                                    : ""
                                            }
                                            {
                                                roleData.viewCustomer ?
                                                    <Link to="/customer" className="">
                                                        <span className="material-icons mr-2">
                                                            contact_phone
                                                        </span>
                                                        Customer
                                                    </Link>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                    : ""
                            }
                            {
                                (roleData.viewRole) ?
                                    <div className="single-list-sidebar">
                                        <button className="tab-button justify-between" onClick={() => setMenuValue(3)}>
                                            <div className="flex  items-center">
                                                <span className="material-icons">
                                                    admin_panel_settings
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
                                                roleData.viewRole ?
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
                                    <p className="mb-0">{userData?.name}</p>
                                    <p className="mb-0">{userData?.role_name}</p>
                                </button>
                                <button className="switch-account" onClick={handleLogout}>

                                    <span className="material-icons">
                                        power_settings_new
                                    </span>
                                </button>
                            </div>
                            <div className="single-list-sidebar">
                                <button className="tab-button justify-between" onClick={() => setMenuValue(4)}>
                                    <div className="flex  items-center">
                                        <span className="material-icons">
                                            settings
                                        </span>
                                        <p className="text-base leading-4">
                                            Setting
                                        </p>
                                    </div>
                                    <svg id="icon1" className={`${menu[4] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div id="menu4" className={`${menu[4] ? 'block' : 'hidden'} sub-menu-link`}>
                                    {
                                        roleData.viewRole ?
                                            <Link to="/template" className="">
                                                <span className="material-icons mr-2">
                                                    manage_accounts
                                                </span>
                                                Template
                                            </Link>
                                            : ""
                                    }
                                    {
                                        roleData.viewRole ?
                                            <Link to="/setting" className="">
                                                <span className="material-icons mr-2">
                                                    manage_accounts
                                                </span>
                                                Setting
                                            </Link>
                                            : ""
                                    }
                                    {
                                        roleData.viewRole ?
                                            <Link to="/smssetting" className="">
                                                <span className="material-icons mr-2">
                                                    sms
                                                </span>
                                                SMS Setting
                                            </Link>
                                            : ""
                                    }
                                    <Link to="/defaults" className="">
                                        <span className="material-icons mr-2">
                                            settings_applications
                                        </span>
                                        Defaults
                                    </Link>
                                </div>
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
                                    <p className="cursor-pointer text-sm leading-5 text-white">{userData?.username}</p>
                                    <p className="cursor-pointer text-xs leading-3 text-gray-300">{userData?.role_name}</p>
                                </button>
                            </div>
                        </div>
                    </div>

                </>
            </div>



            <Profile
                open={open}
                handleClose={handleClose}
                data={formData}
                name={userData?.username}
                onChange={onChange}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
        </div>


    )
}

export default Sidebar
