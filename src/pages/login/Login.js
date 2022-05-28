import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import $ from "jquery"
import { ApiPost } from '../../helper/API/ApiData';
import AuthStorage from '../../helper/AuthStorage';
import STORAGEKEY from '../../config/APP/app.config';
import { useDispatch } from 'react-redux';
import { changeLoginState } from "../../redux/actions/loginAction";
import { getUserData } from "../../redux/actions/userDataAction";
import { changeLicenseState } from '../../redux/actions/licenseAction';

const Login = () => {
    const [mobileNumber, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()
    let history = useHistory();

    const [safeImg, setSafeImg] = useState('username');

    const onKeyDown = (e, name) => {
        if (e.key === "Tab") {

            if (name === 'username') {
                $('#password').trigger('click')
            }
            // console.log("Tab");
        }
    };

    async function doLogin() {

        let errMsg = "";
        if (mobileNumber === "") {
            errMsg = ' \r\n- Number';

        }

        if (password === "") {
            errMsg += ' \r\n- Password';
        }

        if (errMsg !== "") {
            setSafeImg('loginerror')
            window.alert(`Plase enter required details${errMsg}`);
            return;
        } else {
            setSafeImg('loginbutton')
        }
        let item = { loginId: mobileNumber, password };
        setTimeout(

            () => {
                ApiPost("login", item)
                    .then((res) => {
                        AuthStorage.setStorageData(
                            STORAGEKEY.access_token,
                            'Bearer ' + res.access_token,
                            false
                        );
                        AuthStorage.setStorageData(
                            STORAGEKEY.user_id,
                            res.userId,
                            false
                        );
                        delete res.access_token;
                        // delete res.refresh_token;
                        dispatch(getUserData())
                        dispatch(changeLoginState(true))
                        dispatch(changeLicenseState(res.isLicenseUser))


                        if (res.isLicenseUser) {
                            history.push("/LicenseDashboard");
                        } else {
                            history.push("/home");
                        }
                    })
                    .catch((error) => {
                        //   if (error === "Wrong Email") {
                        //     setIncorrectPass("");
                        //     setInvalidEmail(`${t("Login.Errors.Please_check_your_email_address")}`);
                        //   }
                        //   if (error === "Wrong Password") {
                        //     setInvalidEmail("");
                        //     setIncorrectPass(`${t("Login.Errors.Please_check_your_password")}`);
                        //   }
                    });
            }

            , 2000)

    }

    const setImages = (name) => {
        setSafeImg(name)
    }

    return (

        <div className="login-bg" style={{
            backgroundImage: `url("/images/bg-login.jpg")`
        }}>
            <div className="login-box">
                <div className="login-box-content">


                    <div className="background-iamge-safe">

                        {safeImg === 'username'
                            &&
                            <img src="/images/login-img-1.png" alt="" className="" />
                        }
                        {safeImg === 'password'
                            &&
                            <img src="/images/login-img-2.png" alt="" className="" />
                        }

                        {safeImg === 'loginbutton'
                            &&
                            <img src="/images/login-img-3.png" alt="" className="" />

                        }
                        {safeImg === 'loginerror'
                            &&
                            <img src="/images/login-img-4.png" alt="" className="" />

                        }
                    </div>

                    <div className="login-inner-content">
                        <h5>Restaurant</h5>
                        <div>
                            <input onClick={() => { setImages('username') }} onKeyDown={(e) => { onKeyDown(e, 'username') }} className="border-solid border  border-gray-400 w-full rounded px-2 py-3" type="text" placeholder="Mobile Number" onChange={(e) => { setNumber(e.target.value) }} />
                        </div>
                        <div>
                            <input onClick={() => { setImages('password') }} onBlur={() => { setImages('username') }} className="border-solid border border-gray-400 w-full mt-4 rounded px-2 py-3" type="password" id="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <button className="bg-gray-500  text-white font-bold w-full py-3 my-4" type="button" onClick={doLogin}>Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
