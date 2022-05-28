    import { useState } from "react"
import { Container } from "react-bootstrap";
import MessageCKEditor from "../../component/MessageCKEditor";
import { ApiDelete, ApiPatch, ApiPost } from "../../helper/API/ApiData";

const TempletComponent = ({ data, setTempletData }) => {
    const [templateData, setTemplateData] = useState(data);
    const [errMsg, setErrMsg] = useState('');

    const handleChange = (e) => {
        const formData = { ...templateData };
        formData[e.target.name] = e.target.value;
        setTemplateData(formData);
        console.log(formData);
    }

    const submit = () => {
        setErrMsg('');

        let errMsg = [];
        if (templateData.smsUserId === "") {
            errMsg.push('User Id');
        }

        if (templateData.senderId === "") {
            errMsg.push('Sender Id');
        }

        if (templateData.password === "") {
            errMsg.push('Password');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        if (templateData._id) {
            ApiPatch('templet', templateData).then((res) => {
                setTempletData();
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost('templet', templateData).then((res) => {
                setTempletData();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
        // console.log("templateData", templateData);
    }

    //Delete
    const handleDelete = (id) => {
        if (window.confirm('Delete this record?')) {
            ApiDelete(`templet/${id}`, templateData).then((res) => {
                setTempletData();
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    const handleChangeckdata = (newData) => {
        console.log(newData);
        setTemplateData({
            ...templateData,
            content: newData
        });
    };

    const handleEditMessage = (messageId, messageContent, title) => {
        setTemplateData({
            ...templateData,
            content: messageContent
        });
    };

    return (
        <Container className="mx-auto">
            <div className="diplayTable-custom p-4">
                <div className='flex flex-col'>
                    <div className="flex">

                        <div className="pc-label">
                            <div className="w-3/4">
                                <div className="mb-2">
                                    <label className="font-bold">Name</label>
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    className='textBox pc-textboxmail w-full'
                                    type='text'
                                    placeholder='Template Name'
                                    value={templateData.name}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>
                        <div className="pc-label">
                            <div className="w-3/4">
                                <div className="mb-2">
                                    <label className="font-bold pc-spacesec">Template Type</label>
                                </div>
                                <select name="type" className="textBox w-full" value={templateData.type} onChange={(e) => handleChange(e)}>
                                    <option value="">Choose...</option>
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="pc-label mb-4 mt-4"><label className="font-bold">Template content</label></div>
                <MessageCKEditor
                    onChange={handleChangeckdata}
                    onEdit={handleEditMessage}
                    data={templateData.content}
                />
                <div>
                    <label className='dialogError'>{errMsg}</label>
                </div>
                <div className='text-center w-full pb-3 mt-4'>
                    <button className='dialogBtnSave ml-1 pc-dialsavebtn' onClick={submit}>Save</button>
                    <button className='dialogBtnSave ml-1 pc-diallogbtn' onClick={e => handleDelete(templateData._id)}>Delete</button>
                </div>
            </div>
        </Container>
    )
}

export default TempletComponent