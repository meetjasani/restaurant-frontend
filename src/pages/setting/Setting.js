import { Container } from "@mui/material";
import { useEffect, useState } from "react"

const initialData = {
    name: "",
    email: "",
    password: "",
    server: "",
    port: "",
    isEnabled: true
}

const Setting = () => {
    const [settingData, setSettingData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [data, SetData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [errMsg, setErrMsg] = useState("");

    const handleChange = (e) => {
        const _formData = { ...settingData };
        if (e.target.id === 'isEnabled') {
            _formData[e.target.id] = e.target.checked;
            setSettingData(_formData);
            return;
        }
        _formData[e.target.id] = e.target.value;
        setSettingData(_formData);
        // console.log(_formData);
    }

    const handleVerifyEmail = () => {
        console.log("setting", settingData);
    }

    //update
    const handleUpdate = () => {

    }
    return (
        <>
            {/* <div className="flex items-center justify-between"> */}
            <h1 className="pageHeader">Setting</h1>
            <Container className="mx-auto">
                <div className="diplayTable-custom p-4 pc-custom-sec pc-customboxsec">
                    <div className='flex flex-col '>
                        <div className="flex mb-4 pc-flex-boxsec">
                            <div className="w-2/4 pr-4">
                                <div className="pc-label "><label>email</label></div>
                                <input id="email"
                                    className='textBox pc-textboxmail pc-mailboxsec w-full'
                                    type='text'
                                    placeholder='Email'
                                    value={settingData.email}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="w-2/4">
                                <div className="pc-label"><label>name</label></div>
                                <input id="name"
                                    className='textBox pc-textboxname w-full'
                                    type='text'
                                    placeholder='name'
                                    value={settingData.email}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>


                        <div className="w-full mb-4">
                            <div className="pc-label"><label>Password</label></div>
                            <input id="password"
                                className='textBox pc-textboxname w-full'
                                type='password'
                                placeholder='Password'
                                value={settingData.password}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>



                        <div className="flex mb-4 pc-flex-boxsec">
                            <div className="w-2/4 pr-4">
                                <div className="pc-label "><label>SMTP Server</label></div>
                                <input id="server"
                                    className='textBox pc-textboxmail pc-mailboxsec w-full'
                                    type='text'
                                    placeholder='SMTP Server'
                                    value={settingData.server}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div className="w-2/4">
                                <div className="pc-label"><label>SMTP Port</label></div>
                                <input id="port"
                                    className='textBox pc-textboxname w-full'
                                    type='text'
                                    placeholder='SMTP Port'
                                    value={settingData.port}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>



                        {/* <input type='checkbox' id='isEnabled' className="textBox" value='' checked={settingData.isEnabled} onChange={(e) => handleChange(e)} /> */}
                        <div className="flex mb-4 mt-4">
                            <div className="mr-4">
                                <input type="radio" id="male" name="gender" />
                                <label for="male" className="pc-male-sec">Male</label>
                            </div>

                            <div>
                                <input type="radio" id="female" name="gender" />
                                <label for="female" className="pc-male-sec">Female</label>
                            </div>
                        </div>
                    </div>
                    <div className='text-center w-full pb-3 mt-4'>
                        <button className='dialogBtnSave pc-diallogbtn ml-1' onClick={handleVerifyEmail}>Verify Email</button>
                        <button className='dialogBtnSave pc-dialsavebtn ml-1' onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            </Container>


            <table className="user-table-content hidden">
                <thead>
                    <tr className="header text-left">
                        {/* <th style={{ width: '500px' }}>instance</th>
                            <th>Email Item</th> */}
                        <th style={{ width: '600px' }}></th>
                        <th style={{ width: '150px' }}>instance</th>
                        <th style={{ width: '200px' }}></th>
                        <th style={{ width: '100px' }}></th>
                        <th style={{ width: '100px' }}>Email Item</th>
                        
                        {/* <label className="checkbox-container">aaaaa
                                <input type='checkbox' />
                                <span className="checkmark"></span>
                            </label> */}
                    </tr>
                </thead>

            </table>
            {/* </div> */}
        </>
    )
}

export default Setting

