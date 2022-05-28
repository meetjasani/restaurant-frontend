import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { ApiGet, ApiPatch } from "../../helper/API/ApiData";
import Swal from 'sweetalert2';
import { Container } from "react-bootstrap";

const initialData = {
    _id: "",
    sgstRate: 0,
    cgstRate: 0,
    igstRate: 0,
    maxAttend: 0
}

const LicenseDefault = () => {
    const [data, setData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const url = 'default';

    const getDefaultsData = () => {
        ApiGet(url).then(res => {
            setData(res);
        })
    }

    useEffect(() => {
        getDefaultsData();
    }, [])


    const onChange = (e) => {
        const id = e.target.id;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const _data = { ...data };
        _data[id] = value;
        if (id === 'sgstRate' || id === 'cgstRate') {
            _data['sgstRate'] = value;
            _data['cgstRate'] = value;
        }
        setData(_data);
    }

    const handleSave = () => {

        setErrMsg('');
        let errMsg = [];
        if (data.sgstRate !== data.cgstRate) {
            errMsg.push('SGST and CGST must be same');
        }

        if (errMsg.length > 0) {
            setErrMsg(`Enter ${errMsg.join(', ')}`);
            return;
        }

        ApiPatch(url, data).then(res => {
            getDefaultsData();
            Swal.fire({
                text: "Data Updated",
            })
        }).catch(error => {
            Swal.fire({
                text: (error.response.data.message),
            })
        })
    }

    return (
        <Container className="mx-auto">
            <div className="diplayTable-custom p-4">
                <h1 className="pageHeader mb-1">Defaults</h1>
                <div className='flex flex-col'>
                    <div className="flex mb-4">
                        <div className="w-2/4 ">
                            <div className="pc-label mb-2"><label className="font-bold">SGST Rate</label></div>
                            <NumberFormat
                                id="sgstRate"
                                placeholder="SGST Rate"
                                className="textBox pc-textboxmail w-3/4"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={false}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="5"
                                value={data.sgstRate}
                                onChange={onChange}
                            />
                        </div>
                        <div className="w-2/4">
                            <div className="pc-label mb-2"><label className="font-bold">CGST Rate</label></div>
                            <NumberFormat
                                id="cgstRate"
                                placeholder="CGST Rate"
                                className="textBox pc-textboxmail w-3/4"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={false}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="5"
                                value={data.cgstRate}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className="flex mb-4">
                        <div className="w-2/4 ">
                            <div className="pc-label mb-2"><label className="font-bold">IGST Rate</label></div>
                            <NumberFormat
                                id="igstRate"
                                placeholder="IGST Rate"
                                className="textBox pc-textboxmail w-3/4"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={false}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="5"
                                value={data.igstRate}
                                onChange={onChange}
                            />
                        </div>
                        <div className="w-2/4">
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className="flex mb-4">
                        <div className="w-2/4 ">
                            <div className="pc-label mb-2"><label className="font-bold">Max Table Attended At A Time</label></div>
                            <NumberFormat
                                id="maxAttend"
                                placeholder="Max Table"
                                className="textBox pc-textboxmail w-3/4"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={false}
                                allowNegative={false}
                                decimalScale={0}
                                maxLength="2"
                                value={data.maxAttend}
                                onChange={onChange}
                            />
                        </div>
                        <div className="w-2/4">
                        </div>
                    </div>
                </div>
                <div>
                    <label className='dialogError'>{errMsg}</label>
                </div>
                <div className='text-center w-full pb-3 mt-4'>
                    <button className='dialogBtnSave ml-1 pc-dialsavebtn' onClick={handleSave}>Save</button>
                </div>
            </div>
        </Container>
    )
}

export default LicenseDefault