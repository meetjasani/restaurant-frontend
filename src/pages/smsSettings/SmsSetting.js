import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ApiGet } from "../../helper/API/ApiData";
import SmsComponent from './SmsComponent'

const initialData = {
    smsUserId: "",
    senderId: "",
    password: "",
    isDefault: false
}

const SmsSetting = () => {
    const [data, SetData] = useState([]);

    const setSmsData = () => {
        ApiGet('sms').then((res) => {
            if (res.length > 0) {
                SetData(res);
            } else {
                SetData([...data, initialData])
            }
        })
    }

    useEffect(() => {
        setSmsData();
    }, [])

    const handleAdd = () => {
        SetData([...data, initialData])
    }


    return (
        <div className="">
            <Container className="mx-auto">
                <h1 className="pageHeader">SMS Seeting</h1>
            </Container>
            {
                data.map((setting, index) => {
                    return (
                        <SmsComponent key={setting._id ? setting._id : index}
                            data={setting}
                            setSmsData={setSmsData}
                        />
                    )
                })
            }
            <Container className="mx-auto">
                <button className='dialogBtnSave ml-1 pc-dialsavebtn' onClick={handleAdd}>Add</button>
            </Container>
        </div >
    )
}

export default SmsSetting