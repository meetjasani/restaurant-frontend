import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Profile from '../../component/Profile';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AuthStorage from '../../helper/AuthStorage';
import { changeLoginState } from '../../redux/actions/loginAction';
import { useDispatch, useSelector } from 'react-redux';
import { ApiPatch } from "../../helper/API/ApiData";

const initialData = {
    password: "",
    repeat_password: ""
}

const LicenseSidebar = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    let history = useHistory();
    let dispatch = useDispatch();
    const { userData } = useSelector((state) => state.userData);


    //For Sidebar menu 
    let menuArray = [false, false, false];
    const [menu, setMenu] = useState(menuArray);
    const setMenuValue = (props) => {
        let newArr = [...menu];
        newArr[props] = !newArr[props];
        setMenu(newArr);
    }

    const handleClickOpen = () => {
        const _formData = { ...formData };
        _formData.name = userData.userName
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
                    AuthStorage.deauthenticateUser();
                    dispatch(changeLoginState(false));
                    history.push("/");
                }
            })
    }

    return (
        <div>
            <div className="main-sidebar-design">
                <div className="profile-picture">
                    <img src='/images/logo.svg' alt="" />
                    <h3>License</h3>
                </div>
                <div className="sidebar-inner">
                    <div className="single-list-sidebar">
                        <button className="tab-button">
                            <span className="material-icons">
                                grid_view
                            </span>
                            <Link to="/LicenseDashboard" className="text-base leading-4">
                                Dashboard
                            </Link>
                        </button>
                    </div>
                    <div className="single-list-sidebar">
                        <button className="tab-button">
                            <span className="material-icons">
                                restaurant
                            </span>
                            <Link to="/RegisterRestaurant" className="text-base leading-4">
                                Restaurant
                            </Link>
                        </button>
                    </div>
                    <div className="single-list-sidebar">
                        <button className="tab-button">
                            <span className="material-icons">
                                crop_rotate
                            </span>
                            <Link to="/functionality" className="text-base leading-4">
                                Functionality
                            </Link>
                        </button>
                    </div>
                    <div className="profile-menu-footer">
                        <button className="profile-btn" onClick={handleClickOpen}>
                            <img src="https://www.business2community.com/wp-content/uploads/2014/04/profile-picture-300x300.jpg" alt="" />
                            <p className="">{userData?.name}</p>
                            <p className="">{userData?.role_name}</p>
                        </button>
                        <button className="switch-account" onClick={handleLogout}>
                            <span className="material-icons">
                                power_settings_new
                            </span>
                        </button>
                    </div>
                </div>
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

export default LicenseSidebar
