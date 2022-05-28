import React, { useState } from 'react'
import { ApiDelete, ApiPatch, ApiPost } from "../../helper/API/ApiData";
import { Container } from 'react-bootstrap'

const SmsComponent = ({ data, setSmsData }) => {
    const [smsSettingData, setSmsSettingData] = useState(data);
    const [errMsg, setErrMsg] = useState('');

    const onChange = (e) => {
        const _formData = { ...smsSettingData };
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        _formData[e.target.id] = value;
        setSmsSettingData(_formData);
        // console.log(_formData);
    }

    //update
    const handleSave = () => {
        setErrMsg('');

        let errMsg = [];
        if (smsSettingData.smsUserId === "") {
            errMsg.push('User Id');
        }

        if (smsSettingData.senderId === "") {
            errMsg.push('Sender Id');
        }

        if (smsSettingData.password === "") {
            errMsg.push('Password');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        if (smsSettingData._id) {
            ApiPatch('sms', smsSettingData).then((res) => {
                setSmsData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost('sms', smsSettingData).then((res) => {
                setSmsData();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
        console.log("setting", smsSettingData);
    }

    //Delete
    const handleDelete = (id) => {
        if (window.confirm('Delete this record?')) {
            ApiDelete(`sms/${id}`, smsSettingData).then((res) => {
                setSmsData();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    return (
        <>
            <Container className='mx-auto'>
                <div className="diplayTable-custom p-4">
                    <div className='flex flex-col'>
                        <div className="flex mb-4">
                            <div className="w-2/4 ">
                                <div className="pc-label">
                                    <div>
                                        <label className='font-bold'>User Id</label>
                                    </div>
                                    <input id="smsUserId"
                                        className='textBox pc-textboxmail w-3/4 mt-2'
                                        type='text'
                                        placeholder='User Id'
                                        value={smsSettingData.smsUserId}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="w-2/4">
                                <div className="pc-label">
                                    <div>
                                        <label className='font-bold'>Sender Id</label>
                                    </div>
                                    <input id="senderId"
                                        className='textBox pc-textboxname w-3/4 mt-2'
                                        type='text'
                                        placeholder='Sender Id'
                                        value={smsSettingData.senderId}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex mb-4">
                            <div className="w-2/4 ">
                                <div className="pc-label">
                                    <div>
                                        <label className='font-bold'>Password</label>
                                    </div>
                                    <input id="password"
                                        className='textBox pc-textboxmail w-3/4 mt-2'
                                        type='password'
                                        placeholder='password'
                                        value={smsSettingData.password}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <div className="w-2/4">
                                <div className="pc-label flex items-center mt-8 ">

                                    <label className='mr-2	font-bold'>Is Default</label>
                                    <input id="isDefault"
                                        className='textBox pc-textboxname'
                                        type='checkbox'
                                        placeholder='Is Default'
                                        checked={smsSettingData.isDefault}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className='dialogError'>{errMsg}</label>
                    </div>
                    <div className='text-center w-full pb-3 mt-4'>
                        <button className='dialogBtnSave ml-1 pc-dialsavebtn' onClick={handleSave}>Save</button>
                        <button className='dialogBtnSave ml-1 pc-diallogbtn' onClick={e => handleDelete(smsSettingData._id)}>Delete</button>
                    </div>
                </div>
            </Container>
        </>



    )
}

export default SmsComponent