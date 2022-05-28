import React, { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ApiGet } from "../helper/API/ApiData";
import AuthStorage from "../helper/AuthStorage";
import Layout from "../layout/Layout";
import LoginLayout from "../layout/LoginLayout"
import LicenseLayout from "../layout/LicenseLayout"
import Home from './home/Home'
import Login from './login/Login'
import { changeLoginState } from "../redux/actions/loginAction";
import { getUserData } from "../redux/actions/userDataAction";
import Users from "./user/Users";
import LicenseDashboard from "./licensedashboard/LicenseDashboard";
import RegisterRestaurant from "./registerrestaurant/RegisterRestaurant";
import WaitingList from "./waitingList/WaitingList";
import OpenOrderPage from "./orders/OpenOrderPage";
import OrderHistory from "./orders/OrderHistory";
import PickOrder from './orders/PickOrder'
import TakeAwayOrders from './orders/TakeAwayOrders'
import InvoiceHistory from "./invoices/InvoiceHistory";
import GstInvoices from "./invoices/GstInvoices";
import Category from "./masters/category/Category";
import Subcategory from "./masters/subCategory/Subcategory";
import Item from "./masters/items/Item";
import Table from "./masters/tables/Table";
import Customer from "./masters/customer/Customer";
import Functionality from "./adminMaster/functionality/Functionality";
import InvoiceBilling from "./invoices/InvoiceBilling";
import Role from "./adminMaster/role/Role";
import { changeLicenseState } from "../redux/actions/licenseAction";
import Setting from "./setting/Setting";
import SmsSetting from "./smsSettings/SmsSetting";
import LicenseDefault from './licenseDefaults/LicenseDefault'
import Menu from "./menu/Menu";
import Template from "./templetSettings/Template";
import WaitingListHistory from "./waitingList/WaitingListHistory";
import HomeTable from "./home/HomeTable";
import TakeAwayList from "./orders/TakeAwayList";

function Index() {
    // window.scrollTo(0, 0)
    const pathname = ["/login"];
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { is_loggedin } = useSelector((state) => state.login);
    const { is_licensein } = useSelector((state) => state.license);

    useEffect(() => {
        if (AuthStorage.isUserAuthenticated()) {
            ApiGet("user/getuser")
                .then((res) => {
                    // debugger;
                    dispatch(getUserData());
                    dispatch(changeLoginState(true));
                    dispatch(changeLicenseState(res.isLicenseUser));
                    // if (res.isLicenseUser) {
                    //     setLicense(true)
                    //     history.push("/LicenseDashboard");
                    // } else {
                    //     setLicense(false)
                    //     history.push("/home");
                    // }
                })
                .catch((error) => {
                    AuthStorage.deauthenticateUser();
                    history.push("/");
                });
        } else {
            if (!pathname.includes(location.pathname)) {
                history.push("/");
            }
        }
    }, []);


    return (
        <>
            <>
                <Switch>

                    {is_licensein === true &&

                        (
                            <>
                                <RouteWrapper
                                    exact={true}
                                    path="/"
                                    Components={LicenseDashboard}
                                    Layouts={LicenseLayout}
                                    isPrivateRoute={true}
                                />
                                <RouteWrapper
                                    exact={true}
                                    path="/LicenseDashboard"
                                    Components={LicenseDashboard}
                                    Layouts={LicenseLayout}
                                    isPrivateRoute={true}
                                />
                                <RouteWrapper
                                    exact={true}
                                    path="/RegisterRestaurant"
                                    Components={RegisterRestaurant}
                                    Layouts={LicenseLayout}
                                    isPrivateRoute={true}
                                />
                                <RouteWrapper
                                    exact={true}
                                    path="/functionality"
                                    Components={Functionality}
                                    Layouts={LicenseLayout}
                                    isPrivateRoute={true}
                                />
                            </>
                        )
                    }
                    {is_licensein === false &&
                        (
                            <>
                                {is_loggedin === false ? (
                                    <RouteWrapper
                                        exact={true}
                                        path="/"
                                        Components={Login}
                                        Layouts={LoginLayout}
                                        isPrivateRoute={false}
                                    />
                                ) : (
                                    <>
                                        <RouteWrapper
                                            exact={true}
                                            path="/"
                                            Components={HomeTable}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />

                                        <RouteWrapper
                                            exact={true}
                                            path="/home"
                                            Components={HomeTable}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/user"
                                            Components={Users}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/menu"
                                            Components={Menu}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true} path="/wlist"
                                            Components={WaitingList}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true} path="/wlisth"
                                            Components={WaitingListHistory}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/oop"
                                            Components={OpenOrderPage}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/tastatus"
                                            Components={TakeAwayList}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/orders"
                                            Components={OrderHistory}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/pickorder"
                                            Components={PickOrder}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/takeaway"
                                            Components={TakeAwayOrders}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/ih"
                                            Components={InvoiceHistory}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/gst"
                                            Components={GstInvoices}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/invoicebilling"
                                            Components={InvoiceBilling}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/category"
                                            Components={Category}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/subcategory"
                                            Components={Subcategory}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/item"
                                            Components={Item}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/table"
                                            Components={Table}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true}
                                            path="/customer"
                                            Components={Customer}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />

                                        <RouteWrapper
                                            exact={true}
                                            path="/role"
                                            Components={Role}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true} path="/template"
                                            Components={Template}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true} path="/setting"
                                            Components={Setting}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true} path="/smssetting"
                                            Components={SmsSetting}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                        <RouteWrapper
                                            exact={true} path="/defaults"
                                            Components={LicenseDefault}
                                            Layouts={Layout}
                                            isPrivateRoute={true}
                                        />
                                    </>
                                )}
                            </>)
                    }


                    {/* <Redirect from="*" to="/" /> */}
                </Switch>
            </>
        </>
    );
}

export default Index;


function RouteWrapper({
    Components,
    Layouts,
    isPrivateRoute,
    ...rest
}) {
    const { is_loggedin } = useSelector((state) => state.login);
    const history = useHistory();

    const isAuthenticated = isPrivateRoute
        ? is_loggedin
        : true;



    return (
        <>
            {isAuthenticated ? (
                <Route
                    {...rest}
                    render={(props) => (
                        <Layouts >
                            <Components {...props} />
                        </Layouts>
                    )}
                />
            ) : (
                history.push("/")
            )}
        </>
    );
}

