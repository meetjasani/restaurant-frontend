import React, { useContext, useEffect, useState } from 'react';
import { ApiGet, ApiPatch } from '../../helper/API/ApiData';
import Helper from '../../helper/Helper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Swal from "sweetalert2";
import { SocketContext } from '../../SocketContext';
import { Container, Row, Col } from 'react-bootstrap';

const TakeAwayList = () => {
    const [pendingData, SetPendingData] = useState([]);
    const [runningData, SetRunningData] = useState([]);
    const [serverMsg, setServerMsg] = useState({ event: "", message: "" });

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        setOrderData();
    }, [serverMsg])

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            // console.log('connected: ');
            socket.on("takeAwayData", (data) => { setServerMsg(data); })
        });
        return () => socket.disconnect();
    }, [])

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

    const setOrderData = () => {
        ApiGet(`order/tas/${Helper.ORDER_STATUS.OPEN}`).then((res) => {
            SetPendingData(res);
        })
            .catch(err => console.log(err.response.data.message));
        ApiGet(`order/tas/${Helper.ORDER_STATUS.IN_PROGRESS}`).then((res) => {
            SetRunningData(res);
        })
            .catch(err => console.log(err.response.data.message));
    }

    useEffect(() => {
        setOrderData();
    }, [])



    const handleUpdateStatus = (orderNumber, id, status) => {
        Swal.fire({
            title: orderNumber,
            text: `Add to ${status}?`,
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: status
        })
            .then((result) => {
                if (result.isConfirmed) {
                    const data = {
                        _id: id,
                        status: status
                    }
                    ApiPatch('order/delivered', data).then((res) => {
                        setOrderData();
                    }).catch((err) => console.log(err))
                }
            })

    }

    return (
        <>
            <h1 className="pageHeader">Take Away Orders</h1>
            <div className='flex flex-row'>
                <div className="diplayTable-custom p-4 mr-3" style={{ width: '58%' }}>
                    <div className="tablemain-title">
                        <h3>Running Orders</h3>
                    </div>
                    <div className='grid gap-2 grid-cols-4'>
                        {
                            runningData.map(order => {
                                return (
                                    <Card style={{ width: 'fit-content' }} key={order._id}>
                                        <CardContent style={{ height: '75%' }}>
                                            <b>{order.orderNumber}</b>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        order.items.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.itemId.name}</td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        {item.quantity}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </CardContent>
                                        <CardActions>
                                            <button className="diplayTableTwoDeleteBtn" onClick={e => { handleUpdateStatus(order.orderNumber, order._id, Helper.ORDER_STATUS.READY) }}>Ready</button>
                                        </CardActions>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="diplayTable-custom p-4 ml-3" style={{ width: '56%' }}>
                    <div className="tablemain-title">
                        <h3>Pending Orders</h3>
                    </div>
                    <div className='grid gap-2 grid-cols-4 pc-grid-sec'>
                        {
                            pendingData.map(order => {
                                return (
                                    <Card style={{ width: 'fit-content' }} key={order._id}>
                                        <CardContent style={{ height: '75%' }}>
                                            <b>{order.orderNumber}</b>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        order.items.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{item.itemId.name}</td>
                                                                    <td style={{ textAlign: 'right' }}>
                                                                        {item.quantity}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </CardContent>
                                        <CardActions>
                                            <button className="diplayTableTwoDeleteBtn" onClick={e => { handleUpdateStatus(order.orderNumber, order._id, Helper.ORDER_STATUS.IN_PROGRESS) }}>Pick Order</button>
                                        </CardActions>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default TakeAwayList