import moment from "moment";
import { useState, useEffect } from "react";
import Helper from "../../helper/Helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiGet, ApiPatch } from "../../helper/API/ApiData";
import Select from 'react-select';

const OpenOrderPage = () => {
    const [data, SetData] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const url = 'order/ao';
    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });


    const setOrderData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        })
    }

    const setAttendantsList = () => {
        ApiGet('user/l')
            .then((res) => {
                setAttendants(res);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_OPEN_ORDERS, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_OPEN_ORDERS, Helper.CRUD.UPDATE);

            setRightsData(_rightsData);
        }
        setOrderData();
        setAttendantsList();
    }, [userData])

    const updateAttendant = (_id, attendantId) => {
        const data = {
            _id,
            attendantId
        }
        ApiPatch('order/w', data).then((res) => {
            setOrderData();
        }).catch((err) => console.log(err.response.data.message))
        // console.log(data);
    }

    return (
        <>
            <h1 className="pageHeader">Open Dine-in Orders</h1>
            <div className="diplayTable-custom p-4">
                {/* <div className="tablemain-title">
                    <h3>Order</h3>
                </div> */}
                <table className="">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '35px',minWidth:'35px' }}>Sr</th>
                            <th style={{ width: '150px' ,minWidth:'150px'}}>Number</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Tables</th>
                            <th style={{ width: '150px' ,minWidth:'150px'}}>Amount</th>
                            <th style={{ width: '280px',minWidth:'280px' }}>Attendant</th>
                            <th style={{ width: '170px',minWidth:'170px' }}>Inactive (HH:MM)</th>
                            <th style={{ width: '100px',minWidth:'35px' }}>Total Time (HH:MM)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0
                                ?
                                data.map((order, index) => {
                                    return (
                                        <tr key={order._id} className="table-content">
                                            <td >
                                                {index + 1}
                                            </td>
                                            <td>
                                                {order.orderNumber}
                                            </td>
                                            <td>
                                                {order.tableNames.join(', ')}
                                            </td>
                                            <td >
                                                {Helper.GetFormatedAmount(order.netAmount)}
                                            </td>
                                            <td >
                                                {
                                                    rightsData.canUpdate === true ?
                                                        <Select
                                                            id="attendants"
                                                            placeholder="Select Attendant"
                                                            className="reactSelect"
                                                            classNamePrefix="reactSelect"
                                                            options={attendants}
                                                            value={Helper.setComboboxValue(attendants, order.attendantId)}
                                                            // onChange={e => { window.alert(e.value) }}
                                                            onChange={e => { updateAttendant(order._id, e ? e.value : "") }}
                                                        />
                                                        :
                                                        order.attendant
                                                }
                                            </td>
                                            <td >
                                                {
                                                    Helper.GetTimeDiff(order.updatedAt, moment())
                                                }
                                            </td>
                                            <td >
                                                {Helper.GetTimeDiff(order.createdAt, moment())}
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>
                                        <b>No Open Order</b>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default OpenOrderPage