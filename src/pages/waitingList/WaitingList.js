import { useContext, useEffect, useState } from "react"
import Helper from "../../helper/Helper";
import moment from "moment";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../helper/API/ApiData";
import AddWaitingList from "./AddWaitingList";
import AllocateTableDialog from "./AllocateTableDialog";
import { SocketContext } from '../../SocketContext';
import _ from 'lodash'

const initialData = {
    _id: "",
    customerId: "",
    customerName: "",
    contactNumber: "",
    bookingType: Helper.BOOKING_TYPE.IN_PERSON,
    persons: "",
    // status: Helper.WAITING_STATUS.WAITING,
    comments: ""
}

const WaitingList = () => {
    const [open, setOpen] = useState(false);
    const [openTable, setOpenTable] = useState(false);
    const [data, SetData] = useState([]);
    const [formData, setFormData] = useState(initialData);
    const [customers, setCustomers] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState("");
    const [tableData, SetTableData] = useState([]);
    const [selectedTable, setSelectedTable] = useState([]);
    const [isPartialAllocation, setIsPartialAllocation] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });

    const { socket } = useContext(SocketContext);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrMsg("");
        setFormData(initialData);
        setOpen(false);
    };

    const handleClickOpenTable = () => {
        setOpenTable(true);
    };

    const handleCloseTable = () => {
        setOpenTable(false);
    };

    const setWaitingListData = () => {
        ApiGet('wlist/l').then((res) => {
            SetData(res);
        })
    }

    const setCustomersData = () => {
        ApiGet('customer/l').then((res) => {
            setCustomers(res);
        })
    }

    const setAvailableTableData = () => {
        ApiGet('table/a')
            .then((res) => {
                SetTableData(res);
            })
            .catch(err => console.log(err.response.data.message));

    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setCustomersData();
        setWaitingListData();
        setAvailableTableData();
    }, [userData])

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            socket.on("updateTable", (serverMsg) => { setAvailableTableData() })
        })
        return () => socket.disconnect();
    }, [])


    const onChange = (e) => {
        const _formData = { ...formData };
        _formData[e.target.id] = e.target.value;
        setFormData(_formData);
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

    const onStatusChange = (e) => {
        if (window.confirm(`Update Status to ${e.target.value}`)) {
            const wlistData = {
                _id: e.target.id,
                status: e.target.value,
            }
            updateWListStatus(wlistData);
        }
    }

    const handleTableSubmit = (e) => {
        createOrder();
        setSelectedTable([]);
    }

    const createOrder = () => {
        const orderData = {
            tables: selectedTable,
            customerId: selectedRecord.customerId._id
        }
        const wlistData = {
            _id: selectedRecord._id,
            status: Helper.WAITING_STATUS.ALLOCATED,
        }

        //Checking for if partial allocation
        let occupied = 0;
        let _partialAllocation = isPartialAllocation;
        tableData.map(table => {
            if (_.indexOf(selectedTable, table._id) > -1) {
                occupied += table.capicity
            }
        })
        if ((selectedRecord.persons - occupied) > 0 && !isPartialAllocation) {
            _partialAllocation = window.confirm('Is Partial Allocation?');
        }

        ApiPost('order', orderData)
            .then((res) => {
                if (!_partialAllocation) {
                    updateWListStatus(wlistData);
                }
                handleCloseTable();
                setWaitingListData();
            })
            .catch(err => console.log(err.response.data.message));
    }

    const updateWListStatus = (wlistData) => {
        ApiPatch('wlist/s', wlistData).then((wlistRes) => {
            handleCloseTable();
            setWaitingListData();
            setAvailableTableData();
        })
    }

    const handleFormSubmit = () => {
        setErrMsg('');

        if (formData.name === "") {
            setErrMsg("Enter Customer name");
            return;
        }

        if (formData._id) {
            ApiPatch('wlist', formData).then((res) => {
                if (res !== undefined) {
                    handleClose();
                    setWaitingListData();
                }
            }).catch((error) => { setErrMsg(error.response.data.message) });
        } else {
            ApiPost('wlist', formData).then((res) => {
                if (res !== undefined) {
                    console.log(res);
                    setWaitingListData();
                    handleClose();
                }
            }).catch((error) => {
                setErrMsg(error.response.data.message)
            });
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Waiting List",
            text: "Are You Sure to Delete Waiting List ?",
            showCancelButton: true,
            confirmButtonColor: '#ff6877',
            cancelButtonColor: '#404040',
            confirmButtonText: "Delete"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    ApiDelete('wlist' + `/${id}`, formData).then((res) => {
                        setWaitingListData();
                    }).catch((error) => {
                        window.alert(error.response.data.message)
                    });
                }
            })
    }

    const handleEdit = (oldData) => {
        const _formData = { ...formData };
        _formData['_id'] = oldData._id;
        _formData.customerId = oldData.customerId._id;
        _formData.customerName = oldData.customerId.name;
        _formData.contactNumber = oldData.customerId.contactNumber;
        _formData.bookingType = oldData.bookingType;
        _formData.persons = oldData.persons;
        _formData.comments = oldData.comments;
        setFormData(_formData);
        setOpen(true);
    }

    const handleAllocateTable = (row) => {
        setSelectedRecord(row);
        handleClickOpenTable();
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Waiting List</h1>
                {
                    rightsData.canInsert ?
                        <div className="mr-3">
                            <button className="add-user-btn" onClick={handleClickOpen}>
                                <span className="material-icons">
                                    add
                                </span>
                                Add List
                            </button>
                        </div>
                        : ""
                }
            </div>
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>List Information</h3>
                </div>
                <table className="">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '35px', minWidth: '35px' }}>Sr</th>
                            <th style={{ width: '200px', minWidth: '200px' }}>Date</th>
                            <th style={{ width: '150px', minWidth: '150px' }}>Customer Name</th>
                            <th style={{ width: '120px', minWidth: '120px' }}>Contact</th>
                            <th style={{ width: '120px', minWidth: '120px' }}>Booking Type</th>
                            <th style={{ width: '80px', minWidth: '80px' }}>Persons</th>
                            <th style={{ width: '85px', minWidth: '85px' }}>Allocated</th>
                            <th style={{ width: '80px', minWidth: '80px' }}>Pending</th>
                            <th style={{ width: '150px', minWidth: '150px' }}>Status</th>
                            <th style={{ width: '100px', minWidth: '100px' }}>Comments</th>
                            <th style={{ width: '80px', minWidth: '80px' }}>User</th>
                            <th style={{ width: '60px', minWidth: '60px' }}>Waited (HH:MM)</th>
                            <th style={{ width: '90px', minWidth: '90px' }}></th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((row, index) => {
                                return (
                                    <tr key={row._id} className="table-content">
                                        <td style={{ textAlign: '' }}>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {moment().format('YYYY') + ' - '}
                                            {Helper.GetFormatedDate(row.datetime, 'DD-MM-YYYY hh:mm A')}
                                        </td>
                                        <td>
                                            {row.customerId.name}
                                        </td>
                                        <td>
                                            {row.customerId.contactNumber}
                                        </td>
                                        <td>
                                            {row.bookingType}
                                        </td>
                                        <td>
                                            {row.persons}
                                        </td>
                                        <td>
                                            {row.allocated}
                                        </td>
                                        <td>
                                            {row.pending}
                                        </td>
                                        <td>

                                            {
                                                rightsData.canUpdate ?
                                                    <select id={row._id} value={row.status} onChange={onStatusChange} className="select">
                                                        <option value={Helper.WAITING_STATUS.WAITING}>{Helper.WAITING_STATUS.WAITING}</option>
                                                        <option value={Helper.WAITING_STATUS.LEFT}>{Helper.WAITING_STATUS.LEFT}</option>
                                                        <option value={Helper.WAITING_STATUS.NOT_ARRIVED}>{Helper.WAITING_STATUS.NOT_ARRIVED}</option>
                                                    </select>
                                                    :
                                                    row.status
                                            }
                                        </td>
                                        <td>
                                            {row.comments}
                                        </td>
                                        <td>
                                            {row.userId.name}
                                        </td>
                                        <td>
                                            {Helper.GetTimeDiff(row.createdAt, moment())}
                                        </td>
                                        <td style={{ display: 'flex' }}>
                                            {
                                                rightsData.canUpdate ?
                                                    <button className="diplayTableTwoActtiveBtn" onClick={(e) => { handleAllocateTable(row) }}>Allocate Table</button>
                                                    : ''
                                            }
                                            {
                                                rightsData.canUpdate ?
                                                    <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(row) }}>Edit</button>
                                                    : ''
                                            }
                                            {
                                                rightsData.canDelete ?
                                                    <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(row._id) }}>Delete</button>
                                                    : ''
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <AddWaitingList
                open={open}
                handleClose={handleClose}
                data={formData}
                customers={customers}
                onChange={onChange}
                handleFormSubmit={handleFormSubmit}
                errMsg={errMsg}
            />
            <AllocateTableDialog
                open={openTable}
                handleClose={handleCloseTable}
                tableData={tableData}
                selectedTable={selectedTable}
                setIsPartialAllocation={setIsPartialAllocation}
                canInsertOrder={true}
                onChangeTableSelection={onChangeTableSelection}
                handleTableSubmit={handleTableSubmit}
            />


        </>
    )
}

export default WaitingList