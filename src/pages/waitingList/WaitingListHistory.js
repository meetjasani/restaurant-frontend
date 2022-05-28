import { useEffect, useState } from "react"
import Helper from "../../helper/Helper";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiGet, ApiPatch, ApiPost } from "../../helper/API/ApiData";
import AllocateTableDialog from "./AllocateTableDialog";


const WaitingListHistory = () => {
    const [data, SetData] = useState([]);
    const [openTable, setOpenTable] = useState(false);
    const [tableData, SetTableData] = useState([]);
    const [selectedTable, setSelectedTable] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const url = 'wlist';

    let history = useHistory();
    const { userData } = useSelector((state) => state.userData);
    const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });

    const [searchDateF, setSearchDateF] = useState(moment().format("YYYY-MM-DD"));
    const [searchDateT, setSearchDateT] = useState(moment().format("YYYY-MM-DD"));
    const [searchStatus, setSearchStatus] = useState('all');
    const [csvData, setCsvData] = useState([]);


    const handleClickOpenTable = () => {
        setOpenTable(true);
    };

    const handleCloseTable = () => {
        setOpenTable(false);
    };

    const setAvailableTableData = () => {
        ApiGet('table/a')
            .then((res) => {
                SetTableData(res);
            })
            .catch(err => console.log(err.response.data.message));

    }

    const setWaitingListData = () => {
        ApiGet(`${url}?fromDate=${searchDateF}&toDate=${searchDateT}&status=${searchStatus}`).then((res) => {
            SetData(res);
            createCSVData(res);
        })
    }
    const createCSVData = (data) => {
        // console.log(data);
        let _csvData = []
        data.map((res, index) => {
            const csv = {
                sr: index + 1,
                date: res.datetime,
                customerName: res.customerId.name,
                contactNumber: res.customerId.contactNumber,
                bookingType: res.bookingType,
                persons: res.persons,
                statuss: res.status,
                comments: res.comments,
                userr: res.userId.name
            }
            _csvData.push(csv);
        })
        setCsvData(_csvData);
    }

    const handleAllocateTable = (row) => {
        setSelectedRecord(row);
        handleClickOpenTable();
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
        const orderData = {
            tables: selectedTable,
            customerId: selectedRecord.customerId._id
        }
        const wlistData = {
            _id: selectedRecord._id,
            status: Helper.WAITING_STATUS.ALLOCATED,
        }
        ApiPost('order', orderData)
            .then((res) => {
                updateWListStatus(wlistData);
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

    const handleAddToWaitingList = (id) => {
        if (window.confirm('Add To Waiting List?')) {
            const wlistData = {
                _id: id,
                status: Helper.WAITING_STATUS.WAITING,
            }
            updateWListStatus(wlistData);
        }
    }

    useEffect(() => {
        if (userData) {
            if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST_HISTORY, Helper.CRUD.VIEW)) {
                history.push("/");
            }
            const _rightsData = { ...rightsData }
            _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST_HISTORY, Helper.CRUD.INSERT);
            _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST_HISTORY, Helper.CRUD.UPDATE);
            _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.WAITING_LIST_HISTORY, Helper.CRUD.DELETE);
            setRightsData(_rightsData);
        }
        setWaitingListData();
        setAvailableTableData();
    }, [userData])

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pageHeader">Waiting List History</h1>
            </div>
            <div className='pb-2 justify-between flex my-4 items-center'>
                <div className="searching-lable">
                    <label className='transactionLabel mr-1'>From</label>
                    <input type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' value={searchDateF} onChange={e => setSearchDateF(e.target.value)} />
                    <label className='transactionLabel mx-1'> - </label>
                    <input type="date" min='2000-01-01' max='2099-12-31' className='trasactionDate' value={searchDateT} onChange={e => setSearchDateT(e.target.value)} />
                    <select className='select' value={searchStatus} onChange={e => setSearchStatus(e.target.value)} >
                        <option value="all">All</option>
                        <option value={Helper.WAITING_STATUS.WAITING}>{Helper.WAITING_STATUS.WAITING}</option>
                        <option value={Helper.WAITING_STATUS.ALLOCATED}>{Helper.WAITING_STATUS.ALLOCATED}</option>
                        <option value={Helper.WAITING_STATUS.NOT_ARRIVED}>{Helper.WAITING_STATUS.NOT_ARRIVED}</option>
                        <option value={Helper.WAITING_STATUS.LEFT}>{Helper.WAITING_STATUS.LEFT}</option>
                    </select>
                    <button type='button' className='orderBtnAdd ml-2' style={{ padding: '6px 8px' }} onClick={setWaitingListData}>Search</button>
                </div>
                <div>
                    <CSVLink
                        data={csvData}
                        filename={"waitinglist.csv"}
                        className="exe-file-genrator ml-2"
                        target="_blank"
                    >
                        Get Excel
                    </CSVLink>
                </div>
            </div>
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>List Information</h3>
                </div>
                <table className="">
                    <thead>
                        <tr className="header text-left">
                            <th style={{ width: '40px',minWidth:'40px' }}>Sr</th>
                            <th style={{ width: '100px' ,minWidth:'100px'}}>Date</th>
                            <th style={{ width: '200px',minWidth:'200px' }}>Customer Name</th>
                            <th style={{ width: '120px',minWidth:'120px' }}>Contact</th>
                            <th style={{ width: '140px',minWidth:'140px' }}>Booking Type</th>
                            <th style={{ width: '90px',minWidth:'90px' }}>Persons</th>
                            <th style={{ width: '75px',minWidth:'75px' }}>Status</th>
                            <th style={{ width: '90px',minWidth:'90px' }}>Comments</th>
                            <th style={{ width: '100px' ,minWidth:'100px'}}>User</th>
                            <th style={{ width: '200px' ,minWidth:'200px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((row, index) => {
                                return (
                                    <tr key={row._id} className="table-content">
                                        <td style={{ textAlign: 'center' }}>
                                            {index + 1}
                                        </td>
                                        <td>
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
                                            {row.status}
                                        </td>
                                        <td>
                                            {row.comments}
                                        </td>
                                        <td>
                                            {row.userId.name}
                                        </td>
                                        <td>
                                            {
                                                (Helper.GetFormatedDate(row.datetime, 'DD-MM-YYYY') === moment().format('DD-MM-YYYY') && (Helper.WAITING_STATUS.LEFT === row.status || Helper.WAITING_STATUS.NOT_ARRIVED === row.status)) ?
                                                    <>
                                                        <button className="diplayTableTwoActtiveBtn" onClick={(e) => { handleAllocateTable(row) }}>Allocate Table</button>
                                                        <button className="diplayTableTwoEditBtn" onClick={(e) => { handleAddToWaitingList(row._id) }}>Waiting List</button>
                                                    </>
                                                    : ""
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <AllocateTableDialog
                open={openTable}
                handleClose={handleCloseTable}
                tableData={tableData}
                selectedTable={selectedTable}
                canInsertOrder={true}
                onChangeTableSelection={onChangeTableSelection}
                handleTableSubmit={handleTableSubmit}
            />
        </>
    )
}

export default WaitingListHistory