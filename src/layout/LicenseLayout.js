import React from 'react'
import { useSelector } from 'react-redux';
import LicenseSidebar from './sidebar/LicenseSidebar';

const LicenseLayout = ({ children, ...props }) => {
    // const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login)
    const { is_toggleMenu } = useSelector(
        (state) => state.menuToggle
    );
    return (

        <div>

            <div className="main-admin-content">
                <div className="relative-div">
                    <LicenseSidebar />
                    <div className={is_toggleMenu ? "main-page-content-full" : "main-page-content"} {...props}>
                        {children}
                    </div>
                </div>
            </div>

        </div>

    )
};

export default LicenseLayout;