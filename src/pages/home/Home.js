// import Navigation from "../component/Navigation";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useContext, useEffect, useState } from "react";
import Dashboard from "../../component/Dashboard";
import OpenOrder from "../../component/Dashboard/OpenOrder";
import moment from "moment";
import { ApiGet, ApiPatch, ApiPost } from '../../helper/API/ApiData';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../SocketContext';
import AuthStorage from '../../helper/AuthStorage';

const initialOrderData = {
    _id: '',
    date: '',
    orderNumber: '',
    tables: [],
    items: [{
        itemId: '',
        quantity: '',
        rate: '',
        amount: '',
    }],
    grossAmount: '',
    tipToWaiter: '',
    netAmount: '',
    isOpen: true
}

const Home = () => {
    const [itemData, SetItemData] = useState([]);
    const [itemListData, SetItemListData] = useState([]);
    const [tableData, SetTableData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [value, setValue] = useState('1');
    const [selectedTable, setSelectedTable] = useState([]);
    const [payType, setPayType] = useState('CASH');
    const { userData } = useSelector((state) => state.userData);
    const [userDetails, setUserDetails] = useState();
    const [serverMsg, setServerMsg] = useState({ event: "", message: "" });

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        setUserDetails(userData)
    }, [userData])

    useEffect(() => {
        switch (serverMsg.event) {
            case "openOrderUpdate":
                if (serverMsg.message['old'] === AuthStorage.getUserId()) {
                    removeOrderFromList(serverMsg.message['oldData'])
                }
                if (serverMsg.message['new'] === AuthStorage.getUserId()) {
                    addOrderToList(serverMsg.message['newData'])
                }
                break;
            case "updateTable":
                setAvailableTableData();
                break;
            case "availableItem":
                setAvailableItemData();
                setAvailableItemListData();
                break;
            default:
                break;
        }
    }, [serverMsg])

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            // console.log('connected: ');
            socket.on("openOrderUpdate", (data) => { setServerMsg({ event: "openOrderUpdate", message: data }); })
            socket.on("updateTable", (data) => { setServerMsg({ event: "updateTable", message: data }); })
            socket.on("availableItem", (data) => { setServerMsg({ event: "availableItem", message: data }); })
        });
        return () => socket.disconnect();
    }, [])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const setAvailableItemData = () => {
        ApiGet('item/a')
            .then((res) => {
                SetItemData(res);
            })
            .catch(err => console.log(err));
    }

    const setAvailableTableData = () => {
        ApiGet('table/a')
            .then((res) => {
                SetTableData(res);
            })
            .catch(err => console.log(err));

    }

    const setAvailableItemListData = () => {
        ApiGet('item/l')
            .then((res) => {
                SetItemListData(res);
            })
            .catch(err => console.log(err));
    }

    const onChangeTableSelection = (e) => {
        if (e.target.checked) {
            setSelectedTable([...selectedTable, e.target.id]);
        } else {
            let _selected = selectedTable
            _selected = _selected.filter((data) => { return data != e.target.id })
            setSelectedTable(_selected)
        }
    }

    const handleTableSubmit = (e) => {
        createOrder();
        setSelectedTable([]);
    }

    const createOrder = () => {

        const data = {
            tables: selectedTable,
        }
        ApiPost('order', data)
            .then((res) => {
                // addOrderToList(res);
                // setOrdersData([...ordersData, res])
                // setValue(res._id)
                // setAvailableTableData();
            })
            .catch(err => console.log(err));
    }

    const addOrderToList = (data) => {
        const index = ordersData.findIndex((order) => order._id === data._id)
        if (index === -1) {
            setOrdersData([...ordersData, data])
        }
        setAvailableTableData();
    }

    const getOpenOrders = () => {
        ApiGet('order/o')
            .then((res) => {
                setOrdersData(res);
            })
            .catch(err => console.log(err));

    }

    const updateOrder = (order, isOpen = true) => {
        if (!isOpen) {
            if (!window.confirm('Close Order?')) { return }
        }
        const data = {
            _id: order._id,
            items: order.items,
            grossAmount: order.grossAmount,
            tipToWaiter: order.tipToWaiter,
            netAmount: order.netAmount,
            orderStatus: isOpen ? 'open' : 'closed',
            paymentMethod: payType
        }
        ApiPatch('order', data).then((res) => {
            if (!isOpen) {
                setValue('1');
                removeOrderFromList(data._id);
                // let _ordersData = JSON.parse(JSON.stringify(ordersData));
                // _ordersData = _ordersData.filter((a) => a._id !== data._id)
                // setOrdersData(_ordersData);
                // setAvailableTableData();
            }
        }).catch((err) => console.log(err))
        // console.log(data);
    }

    const removeOrderFromList = (orderId) => {
        let _ordersData = JSON.parse(JSON.stringify(ordersData));
        _ordersData = _ordersData.filter((a) => a._id !== orderId)
        setOrdersData(_ordersData);
        setAvailableTableData();
        setValue('1');
    }

    const addItemToOrder = (id, item) => {
        const _ordersData = JSON.parse(JSON.stringify(ordersData));
        _ordersData.map((order) => {
            if (order._id === id) {
                const index = order.items.findIndex((res) => res.itemId === item.itemId)
                if (index < 0) {
                    order.items.push(item)
                    order.grossAmount += item.amount;
                    order.netAmount += item.amount;
                } else {
                    const oldAmount = order.items[index].amount;
                    order.items[index].quantity = +order.items[index].quantity + +item.quantity;
                    order.items[index].amount = order.items[index].quantity * item.rate;
                    order.grossAmount += order.items[index].amount - oldAmount;
                    order.netAmount += order.items[index].amount - oldAmount;
                }
                updateOrder(order);
            }
        })
        setOrdersData(_ordersData);
    }

    const handleRemoveItem = (id, itemId) => {
        const _ordersData = JSON.parse(JSON.stringify(ordersData));
        _ordersData.map((order) => {
            if (order._id === id) {
                order.grossAmount = 0;
                order.items = order.items.filter((item) => {
                    if (item.itemId !== itemId) {
                        order.grossAmount += item.amount
                        return true;
                    }
                })
                order.netAmount = +order.tipToWaiter + +order.grossAmount;
                updateOrder(order);
            }
        })
        setOrdersData(_ordersData);
    }

    const handleDecreseItem = (id, itemId) => {
        const _ordersData = JSON.parse(JSON.stringify(ordersData));
        _ordersData.map((order) => {
            if (order._id === id) {
                const index = order.items.findIndex((res) => res.itemId === itemId);
                if (order.items[index].quantity > 1) {
                    const oldAmount = order.items[index].amount;
                    order.items[index].quantity = +order.items[index].quantity - 1;
                    order.items[index].amount = order.items[index].quantity * order.items[index].rate;
                    order.grossAmount += order.items[index].amount - oldAmount;
                    order.netAmount += order.items[index].amount - oldAmount;
                }
                updateOrder(order);
            }
        })
        setOrdersData(_ordersData);
    }

    const onBlur = (id, value) => {
        const _ordersData = JSON.parse(JSON.stringify(ordersData));
        _ordersData.map((order) => {
            if (order._id === id) {
                order.tipToWaiter = value;
                // console.log(+order.tipToWaiter + +order.grossAmount);
                order.netAmount = +order.tipToWaiter + +order.grossAmount;
            }
            updateOrder(order);
        })
        setOrdersData(_ordersData);
    }

    useEffect(() => {
        setAvailableItemData();
        setAvailableItemListData();
        setAvailableTableData();
        getOpenOrders();
    }, [])

    return (
        <>
            <h1 className="pageHeader">Dashboard</h1>
            {/* <hr className="pageHeaderHr" /> */}
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: '#d9d9d9' }}>
                        <TabList onChange={handleChange} >
                            <Tab label="Home" value="1" />
                            {
                                ordersData.map((order, index) => {
                                    return (
                                        <Tab label={order.tableNames.join(', ')} value={order._id} key={order._id} />
                                    )
                                })
                            }
                        </TabList>
                    </Box>
                    <TabPanel sx={{ paddingLeft: 0, paddingRight: 0 }} value="1">
                        <Dashboard
                            itemData={itemData}
                            tableData={tableData}
                            selectedTable={selectedTable}
                            onChangeTableSelection={onChangeTableSelection}
                            handleTableSubmit={handleTableSubmit}
                            userData={userDetails}
                        />
                    </TabPanel>
                    {
                        ordersData.map((order) => {
                            return (
                                <TabPanel value={order._id} key={order._id}>
                                    <OpenOrder
                                        data={order}
                                        itemData={itemListData}
                                        payType={payType}
                                        setPayType={setPayType}
                                        addItemToOrder={addItemToOrder}
                                        handleRemoveItem={handleRemoveItem}
                                        handleDecrese={handleDecreseItem}
                                        onBlur={onBlur}
                                        handleCloseOrder={updateOrder}
                                    />
                                </TabPanel>
                            )
                        })
                    }
                </TabContext>
            </Box>
        </>
    )
}

export default Home