import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { checkbox, CheckboxContext } from '../CheckboxContext';
import Footer from './footer/Footer'
import Header from './header/Header'
import Sidebar from './sidebar/Sidebar';
const Layout = ({ children, ...props }) => {
    // const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login)
    const { is_toggleMenu } = useSelector(
        (state) => state.menuToggle
    );

    const [siderbar, setSiderbar] = useState(true)
    return (
        <div>
            <Header siderbar={siderbar}/>
            <div className="main-admin-content">
                <div className="relative-div">
                    <Sidebar  setSiderbar={setSiderbar} siderbar={siderbar}/>
                    <div className={is_toggleMenu ? "main-page-content" : "main-page-content-full"} {...props}>
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
};

export default Layout;