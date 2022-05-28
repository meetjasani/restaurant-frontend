import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet } from "../../helper/API/ApiData";
import Helper from "../../helper/Helper";
import ViewOrder from "./ViewOrder";

const initialData = {
    _id: "",
    date: "",
    orderNumber: "",
    tables: [{
        _id: "",
        name: ""
    }],
    items: [
        {
            itemId: {
                _id: "",
                name: ""
            },
            quantity: 0,
            rate: 0,
            amount: 0
        }
    ],
    totalAmount: 0,
    userId: {
        _id: "",
        name: ""
    }
}

const OrderHistory = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialData);
    const [errMsg, setErrMsg] = useState("");
    const [data, SetData] = useState([]);
    const url = 'order';

    const [searchDateF, setsearchDateF] = useState(moment().startOf('month').format("YYYY-MM-DD"));
    const [searchDateT, setsearchDateT] = useState(moment().format("YYYY-MM-DD"));
    const [searchType, setSearchType] = useState('all');

    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canUpdate: false, canDelete: false });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setFormData(initialData);
        setOpen(false);
    };

    const handleView = (oldData) => {
        setFormData(oldData);
        handleClickOpen();
    }

    const setOrderData = () => {
        ApiGet(`${url}?fromDate=${searchDateF}&toDate=${searchDateT}&type=${searchType}`).then((res) => {
            SetData(res);
        }).catch((err) => console.log(err.response.data.message));
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Order",
            text: "Are You Sure to Delete Order?",
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: "Delete"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    ApiDelete(`${url}/${id}`).then((res) => {
                        setOrderData(res.data);
                    }).catch((err) => console.log(err.response.data.message));
                }
            })
        // if (window.confirm('Delete Order?')) {
        //     axios.delete(`${url}/${id}`).then((res) => {
        //         setOrderData(res.data);
        //     }).catch((err) => console.log(err))
        // }
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_HISTORY, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_HISTORY, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.ORDERS_HISTORY, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setOrderData();
    }, [userData])

    return (
        <>
            <h1 className="pageHeader">Orders</h1>
            {/* <hr className="pageHeaderHr" /> */}
            <div className='pb-2 justify-between flex my-4 items-center'>
                <div className="searching-lable">
                    <label className='transactionLabel mr-1'>From</label>
                    <input type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' value={searchDateF} onChange={e => setsearchDateF(e.target.value)} />
                    <label className='transactionLabel mx-1'>-</label>
                    <input type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' value={searchDateT} onChange={e => setsearchDateT(e.target.value)} />
                    <select className='select' value={searchType} onChange={e => setSearchType(e.target.value)} >
                        <option value="all">All</option>
                        <option value={Helper.ORDER_TYPE.DINE_IN}>DINE IN</option>
                        <option value={Helper.ORDER_TYPE.TAKE_AWAY}>TAKE AWAY</option>
                    </select>
                    <button type='button' className='orderBtnAdd ml-2' style={{ padding: '6px 8px' }} onClick={setOrderData}>Search</button>
                </div>
                <div>

                </div>
            </div>
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>Order History</h3>
                </div>
                <table className="">
                    <thead>
                        <tr className="header text-left">
                            <th></th>
                            <th style={{ width: '40px' ,minWidth:'40px'}}>Sr</th>
                            <th style={{ width: '120px',minWidth:'120px' }}>Date</th>
                            <th style={{ width: '120px' ,minWidth:'120px'}}>Type</th>
                            <th style={{ width: '120px' ,minWidth:'120px'}}>Number</th>
                            <th style={{ width: '100px' ,minWidth:'100px'}}>Tables</th>
                            <th style={{ width: '120px',minWidth:'120px' }}>Gross</th>
                            <th style={{ width: '120px',minWidth:'120px' }}>Tip</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Net Amount</th>
                            <th style={{ width: '130px',minWidth:'130px' }}>Attendant</th>
                            <th style={{ width: '200px',minWidth:'200px' }}>Updated Date/Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0
                                ?
                                data.map((order, index) => {
                                    return (
                                        <>
                                            <div className="mt-2 mb-2"></div>
                                            <tr key={order._id} className="table-content">
                                                <td>
                                                    <button className="flex items-center" onClick={(e) => { handleView(order) }} style={{ width: '80px',minWidth:'80px' }}>
                                                        <span className="material-icons mr-2">
                                                            fullscreen
                                                        </span>
                                                        View
                                                    </button>

                                                </td>
                                                <td >
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    {Helper.GetFormatedDate(order.date, 'DD-MM-YYYY')}
                                                </td>
                                                <td style={{ textTransform: "uppercase" }}>
                                                    {order.orderType}
                                                </td>
                                                <td>
                                                    {order.orderNumber}
                                                </td>
                                                <td>
                                                    {Helper.getArrayToString(order.tables, "name")}
                                                </td>
                                                <td >
                                                    {Helper.GetFormatedAmount(order.grossAmount)}
                                                </td>
                                                <td >
                                                    {Helper.GetFormatedAmount(order.tipToWaiter)}
                                                </td>
                                                <td >
                                                    {Helper.GetFormatedAmount(order.netAmount)}
                                                </td>
                                                <td >
                                                    {order.attendantId?.name}
                                                </td>
                                                <td >
                                                    {Helper.GetFormatedDate(order.updatedAt, 'DD-MM-YYYY hh:mm A')}
                                                </td>
                                                <td>
                                                    {
                                                        rightsData.canDelete ?
                                                            <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(order._id) }}>Delete</button>
                                                            : ""
                                                    }
                                                </td>
                                            </tr>
                                            <div className="mt-2 mb-2"></div>

                                        </>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center' }}>
                                        <b>No orders in selected date range</b>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <ViewOrder
                open={open}
                handleClose={handleClose}
                data={formData}
            />
        </>
    )
}

export default OrderHistory