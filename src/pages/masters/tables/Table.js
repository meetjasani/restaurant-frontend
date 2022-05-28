import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from "../../../helper/API/ApiData";
import Helper from "../../../helper/Helper";
import AddTable from "./AddTable";

const initialData = {
  name: "",
  capicity: 0,
  description: "",
  entryEnabled: true,
  sequanceNo: ""
}

const Table = () => {
  const [open, setOpen] = useState(false);
  const [data, SetData] = useState([]);
  const [formData, setFormData] = useState(initialData);
  const [errMsg, setErrMsg] = useState("");
  const url = 'table';

  let history = useHistory();
  const { userData } = useSelector((state) => state.userData);
  const [rightsData, setRightsData] = useState({ canInsert: false, canUpdate: false, canDelete: false });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setErrMsg("");
    setFormData(initialData);
    setOpen(false);
  };

  const setTableData = () => {
    ApiGet(url).then((res) => {
      SetData(res);
    })
  };

  useEffect(() => {
    if (userData) {
      if (!Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_TABLE, Helper.CRUD.VIEW)) {
        history.push("/");
      }
      const _rightsData = { ...rightsData }
      _rightsData.canInsert = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_TABLE, Helper.CRUD.INSERT);
      _rightsData.canUpdate = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_TABLE, Helper.CRUD.UPDATE);
      _rightsData.canDelete = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.MASTER_TABLE, Helper.CRUD.DELETE);
      setRightsData(_rightsData);
    }
    setTableData();
  }, [userData])

  const onChange = (e) => {
    // console.log(e.target.id,"-",e.target.checked);
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    const _formData = { ...formData };
    _formData[e.target.id] = value;
    setFormData(_formData);
  }

  const handleFormSubmit = () => {
    setErrMsg('');
    let errMsg = [];
    if (formData.name === "") {
      errMsg.push('Table name');
    }

    if (formData.capicity === "") {
      errMsg.push('Capicity');
    }

    if (formData.sequanceNo === "") {
      errMsg.push('Sequance No');
    }

    if (errMsg.length > 0) {
      setErrMsg(`Enter ${errMsg.join(', ')}`);
      return;
    }

    if (formData._id) {
      ApiPatch(url, formData).then((res) => {
        handleClose();
        setTableData();
      }).catch((error) => { setErrMsg(error.response.data.message) });
    } else {
      ApiPost(url, formData).then((res) => {
        setTableData();
        handleClose();
      }).catch((error) => {
        setErrMsg(error.response.data.message)
      });
    }
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Catagory",
      text: "Are You Sure to Delete a Catagory",
      showCancelButton: true,
      confirmButtonColor: '#ff6877',
      cancelButtonColor: '#404040',
      confirmButtonText: "Delete"
    })
      .then((result) => {
        if (result.isConfirmed) {
          ApiDelete(url + `/${id}`, formData).then((res) => {
            setTableData();
          }).catch((error) => {
            Swal.fire({
              text: (error.response.data.message),
            })
          });
        }
      })
  }


  const handleEdit = (oldData) => {
    const _formData = { ...formData };
    _formData['_id'] = oldData._id;
    _formData.name = oldData.name;
    _formData.capicity = oldData.capicity;
    _formData.description = oldData.description;
    _formData.entryEnabled = oldData.entryEnabled;
    _formData.sequanceNo = oldData.sequanceNo;
    setFormData(_formData);
    setOpen(true);
  }

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between">
          <h1 className="pageHeader">Table</h1>
          {
            rightsData.canInsert ?
              <div className="mr-3">
                <button className="add-user-btn" onClick={handleClickOpen}>
                  <span className="material-icons">
                    add
                  </span>
                  Tables
                </button>
              </div>
              :
              ""
          }
        </div>
        <div className="diplayTable-custom  p-4">
        <table >
          <thead>
            <tr className="header text-left">
              <th style={{ width: '40px',minWidth:'40px' }}>Sr</th>
              <th style={{ width: '130px',minWidth:'130px'  }}>Name</th>
              <th style={{ width: '90px',minWidth:'90px'  }}>Capicity</th>
              <th style={{ width: '210px',minWidth:'210px'  }}>Description</th>
              <th style={{ width: '100px',minWidth:'100px'  }}>Enabled</th>
              <th style={{ width: '150px',minWidth:'150px'  }}>User</th>
              <th style={{ width: '210px',minWidth:'210px'  }}>Updated Date/Time</th>
              <th style={{ width: '100px',minWidth:'100px'  }}></th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((row, index) => {
                return (
                  <>
                    <div className="mt-2 mb-2"></div>
                    <tr key={row._id} className="table-content">
                      <td >
                        {index + 1}
                      </td>
                      <td>
                        {row.name}
                      </td>
                      <td >
                        {row.capicity}
                      </td>
                      <td>
                        {row.description}
                      </td>
                      <td >
                        {row.entryEnabled.toString()}
                      </td>
                      <td>
                        {row.userId.name}
                      </td>
                      <td >
                        {Helper.GetFormatedDate(row.updatedAt, 'DD-MM-YYYY hh:mm A')}
                      </td>
                      <td >
                        {
                          rightsData.canUpdate ?
                            <button className="diplayTableTwoEditBtn" onClick={(e) => { handleEdit(row) }}>Edit</button>
                            : ""
                        }
                        {
                          rightsData.canDelete ?
                            <button className="diplayTableTwoDeleteBtn" onClick={(e) => { handleDelete(row._id) }}>Delete</button>
                            : ""
                        }
                      </td>
                    </tr>
                    <div className="mt-2 mb-2"></div>
                  </>
                )
              })
            }
          </tbody>
        </table>
        <AddTable
          open={open}
          handleClose={handleClose}
          data={formData}
          onChange={onChange}
          handleFormSubmit={handleFormSubmit}
          errMsg={errMsg}
        />
        </div>
      </div>
    </>
  )
}

export default Table