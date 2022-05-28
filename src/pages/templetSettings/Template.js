import { useEffect, useState } from "react"
import TempletComponent from "./TempletComponent";
import { ApiGet } from "../../helper/API/ApiData";
import { Container } from "react-bootstrap";

const initialData = {
    name: "",
    type: "",
    content: "",
    isDefault: false
}

const Template = () => {
    const [data, SetData] = useState([]);

    const setTempletData = () => {
        ApiGet('templet').then((res) => {
            if (res.length > 0) {
                SetData(res);
            } else {
                SetData([...data, initialData])
            }
        })
    }

    useEffect(() => {
        setTempletData();
    }, [])

    const handleAdd = () => {
        SetData([...data, initialData])
    }

    return (
        <div >
            <Container className="mx-auto">
                <h1 className="pageHeader">Template</h1>
            </Container>
            {
                data.map((setting, index) => {
                    return (
                        <TempletComponent key={setting._id ? setting._id : index}
                            data={setting}
                            setTempletData={setTempletData}
                        />
                    )
                })
            }
            <Container className="mx-auto">
                <button className='dialogBtnSave ml-1 pc-dialsavebtn' onClick={handleAdd}>Add</button>
            </Container>
        </div>
    )
}
export default Template