import { useContext, useEffect, useRef, useState } from "react"
import Helper from "../../helper/Helper";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../helper/API/ApiData";
import AddTakeAwayOrders from "./AddTakeAwayOrders";
import moment from "moment";
import Swal from "sweetalert2";
import Stepper from 'react-stepper-horizontal'
import { SocketContext } from '../../SocketContext';

const initialData = {
    items: [],
    grossAmount: 0,
    paymentMethod: "CASH"
}

const TakeAwayOrders = () => {
    const [data, SetData] = useState([]);
    const [orderData, setOrderData] = useState(initialData);
    const [itemData, SetItemData] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [serverMsg, setServerMsg] = useState({ event: "", message: "" });
    const itemSelect = useRef(null);

    const { socket } = useContext(SocketContext);

    //Steps for stepper
    const steps = [
        {
            title: "OPEN"
        }, {
            title: "IN PROGRESS"
        }, {
            title: "READY"
        }, {
            title: "DELIVERED"
        },
    ]

    //Object for Order Status
    const orderStatus = {
        open: 0,
        inProgress: 1,
        ready: 2,
        closed: 3
    }

    const setTAOrderData = () => {
        ApiGet('order/ta').then((res) => {
            SetData(res);
        })
            .catch(err => console.log(err.response.data.message));
    }

    const setAvailableItemData = () => {
        ApiGet('item/l')
            .then((res) => {
                SetItemData(res);
            })
            .catch(err => console.log(err.response.data.message));
    }

    useEffect(() => {
        setTAOrderData();
    }, [serverMsg])

    useEffect(() => {
        setTAOrderData();
        setAvailableItemData();
        socket.connect();
        socket.on('connect', () => {
            // console.log('connected: ');
            socket.on("takeAwayStatus", (data) => { setServerMsg(data); })
        });
        return () => socket.disconnect();
    }, [])

    const handleAddItem = (event) => {
        const itemId = selectedItem;
        // const q ty = quantity;
        let rate = 0;
        itemData.map((res) => {
            if (res.value === selectedItem) {
                rate = res.price;
            }
        })
        const amount = +quantity * rate;

        const item = {
            itemId: itemId,
            quantity: quantity,
            rate: rate,
            amount: amount
        }

        if (itemId !== "" && quantity !== 0 && quantity !== "") {
            const _orderData = JSON.parse(JSON.stringify(orderData));

            const index = _orderData.items.findIndex((res) => res.itemId === item.itemId)
            if (index < 0) {
                _orderData.items.push(item)
                _orderData.grossAmount += item.amount;
            } else {
                const oldAmount = _orderData.items[index].amount;
                _orderData.items[index].quantity = +_orderData.items[index].quantity + +item.quantity;
                _orderData.items[index].amount = _orderData.items[index].quantity * item.rate;
                _orderData.grossAmount += _orderData.items[index].amount - oldAmount;
            }

            setOrderData(_orderData);
            setQuantity("");
            setSelectedItem("");
            itemSelect.current.focus();
        }
    }

    const handleRemoveItem = (itemId) => {
        const _orderData = JSON.parse(JSON.stringify(orderData));

        _orderData.grossAmount = 0;
        _orderData.items = _orderData.items.filter((item) => {
            if (item.itemId !== itemId) {
                _orderData.grossAmount += item.amount
                return true;
            }
        })

        setOrderData(_orderData);
    }

    const handleDecreseItem = (itemId) => {
        const _orderData = JSON.parse(JSON.stringify(orderData));

        const index = _orderData.items.findIndex((res) => res.itemId === itemId);
        if (_orderData.items[index].quantity > 1) {
            const oldAmount = _orderData.items[index].amount;
            _orderData.items[index].quantity = +_orderData.items[index].quantity - 1;
            _orderData.items[index].amount = _orderData.items[index].quantity * _orderData.items[index].rate;
            _orderData.grossAmount += _orderData.items[index].amount - oldAmount;
        }
        setOrderData(_orderData);
    }

    const handlePayTypeChange = (e) => {
        const _orderData = { ...orderData };
        _orderData.paymentMethod = e.target.value;
        setOrderData(_orderData);
    }

    const handlePlaceOrder = () => {
        console.log(orderData);

        if (orderData.items.length === 0) {
            window.alert('Noting added to place order.');
            itemSelect.current.focus();
            return;
        }

        if (orderData._id) {
            ApiPatch('order/t', orderData)
                .then((res) => {
                    setOrderData(initialData);
                    setQuantity("");
                    setSelectedItem("");
                    itemSelect.current.focus();
                    setTAOrderData();
                })
                .catch(err => console.log(err.response.data.message));
        } else {
            ApiPost('order/t', orderData)
                .then((res) => {
                    setOrderData(initialData);
                    setQuantity("");
                    setSelectedItem("");
                    itemSelect.current.focus();
                    setTAOrderData();
                })
                .catch(err => console.log(err.response.data.message));
        }
    }

    const handleCancle = () => {
        setOrderData(initialData);
    }

    const handleDeliver = (id, orderNumber, amount, paymentMethod) => {
        Swal.fire({
            title: orderNumber,
            text: `Order Delivered and Payment of ${amount} Received via ${paymentMethod}?`,
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: "Delivered"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const data = {
                        _id: id,
                        status: Helper.ORDER_STATUS.DELIVERED
                    }
                    ApiPatch('order/delivered', data).then((res) => {
                        setTAOrderData()
                    }).catch((err) => console.log(err.response.data.message));
                }
            })
    }

    const handleEdit = (oldData) => {
        const _orderData = { ...orderData };
        _orderData._id = oldData._id;
        _orderData.orderNumber = oldData.orderNumber
        _orderData.items = oldData.items;
        _orderData.paymentMethod = oldData.paymentMethod;
        _orderData.grossAmount = oldData.grossAmount;
        setOrderData(_orderData);
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
                    ApiDelete(`order/${id}`).then((res) => {
                        setTAOrderData(res.data);
                    }).catch((err) => console.log(err))
                }
            })
    }

    return (
        <>
            <h1 className="pageHeader">Open Take-away Orders</h1>
            <div className="diplayTable-custom p-4">
                <AddTakeAwayOrders
                    data={orderData}
                    itemSelect={itemSelect}
                    itemData={itemData}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    quantity={quantity}
                    handleAddItem={handleAddItem}
                    handleDecreseItem={handleDecreseItem}
                    handleRemoveItem={handleRemoveItem}
                    setQuantity={setQuantity}
                    handlePayTypeChange={handlePayTypeChange}
                    handlePlaceOrder={handlePlaceOrder}
                    handleCancle={handleCancle}
                />
            </div>
            <div className="diplayTable-custom p-4 mt-5">
                <div className="tablemain-title">
                    <h3>Open Order List</h3>
                </div>
                <table className="">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '35px',minWidth:'35px' }}>Sr</th>
                            <th style={{ width: '150px',minWidth:'150px' }}>Number</th>
                            <th style={{ width: '180px',minWidth:'180px' }}>Status</th>
                            <th style={{ width: '180px',minWidth:'180px' }}>Time Left (HH:MM)</th>
                            <th style={{ width: '180px',minWidth:'180px' }}>Inactive (HH:MM)</th>
                            <th style={{ width: '100px',minWidth:'35px' }}>Amount</th>
                            <th style={{ width: '100px',minWidth:'35px' }}></th>
                            <th style={{ width: '150px',minWidth:'35px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0
                                ?
                                data.map((order, index) => {
                                    return (
                                        <tr key={order._id} className="table-content">
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {order.orderNumber}
                                            </td>
                                            <td>
                                                <Stepper
                                                    steps={steps}
                                                    activeStep={orderStatus[order.orderStatus]}
                                                    circleTop={5}
                                                    size={20}
                                                    circleFontSize={10}
                                                    titleFontSize={10}
                                                    defaultBorderWidth={5}
                                                />
                                            </td>
                                            <td>
                                                {
                                                    Helper.GetTimeDiff(order.createdAt, moment())
                                                }
                                            </td>
                                            <td>
                                                {
                                                    Helper.GetTimeDiff(order.updatedAt, moment())
                                                }
                                            </td>
                                            <td>
                                                {order.grossAmount}
                                            </td>
                                            <td>
                                                {
                                                    order.orderStatus === Helper.ORDER_STATUS.READY ?
                                                        <button className="diplayTableTwoEditBtn" onClick={(e) => { handleDeliver(order._id, order.orderNumber, order.grossAmount, order.paymentMethod) }}>Deliver</button>
                                                        : ""
                                                }
                                            </td>
                                            <td>
                                                {
                                                    order.orderStatus === Helper.ORDER_STATUS.OPEN ?
                                                        <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(order) }}>Edit</button>
                                                        : ""
                                                }
                                                <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(order._id) }}>Delete</button>
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

export default TakeAwayOrders