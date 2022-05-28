import moment from "moment";
import { useState, useEffect } from "react";
import Helper from "../../helper/Helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiGet, ApiPatch } from "../../helper/API/ApiData";


const PickOrder = () => {
    const [data, SetData] = useState([]);
    const url = 'order/uo';
    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });

    const setOrderData = () => {
        ApiGet(url).then((res) => {
            SetData(res);
        })
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.PICK_ORDER, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.PICK_ORDER, Helper.CRUD.UPDATE);

            setRightsData(_rightsData);
        }
        setOrderData();
    }, [userData])

    const updateAttendant = (_id) => {
        const data = {
            _id,
            attendantId: userData.user_id
        }
        ApiPatch('order/w', data).then((res) => {
            setOrderData();
        }).catch((err) => console.log(err.response.data.message))
        // console.log(data);
    }

    return (
        <>
            <h1 className="pageHeader">Open Orders</h1>
            {/* <hr className="pageHeaderHr" /> */}
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>Order</h3>
                </div>
                <table className="">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '35px' }}>Sr</th>
                            <th style={{ width: '100px' }}>Number</th>
                            <th style={{ width: '300px' }}>Tables</th>
                            <th style={{ width: '100px' }}></th>
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
                                                {
                                                    rightsData.canUpdate ?
                                                        <button className="diplayTableTwoActtiveBtn" onClick={(e) => { updateAttendant(order._id) }}>Pick Order</button>
                                                        : ""
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>
                                        <b>No Open Order or Reached Max Limit</b>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PickOrder