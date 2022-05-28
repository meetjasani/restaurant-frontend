import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import Select from 'react-select';
import Helper from "../../../helper/Helper";


const AddRole = ({ open, handleClose, data, functionalities, onChange, toggleAllHorizontal, toggleAllVerticle, handleFormSubmit, errMsg }) => {
    // console.log(data);
    const { _id, name, description, rights, isEnabled } = data;

    const hasRight = (functionalityId, CRUD) => {
        if (rights !== undefined) {
            const index = rights.findIndex((right) => right.functionalityId === functionalityId)
            if (index !== -1) {
                return rights[index][CRUD]
            }
        }
        return false;
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {!_id ? 'Add ' : 'Update '}Role
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" className='textBox mb-2' type='text' placeholder='Role Name' value={name} onChange={onChange} />
                    <textarea id="description" className='textBox mb-2' placeholder='Description' value={description} onChange={onChange} />
                    {/* <fieldset className="orderFieldSet">
                        <legend>Add Functionality</legend>
                        <form action="" method="">
                            <div className="flex items-center ">
                                <Select
                                    autoFocus
                                    id="itemSelect"
                                    isClearable
                                    backspaceRemovesValue
                                    escapeClearsValue
                                    placeholder="Select Functionality"
                                    className="reactSelect"
                                    classNamePrefix="reactSelect"
                                    options={functionalities}
                                    value={Helper.setComboboxValue(functionalities, selectedItem)}
                                    // onChange={e => { window.alert(e.value) }}
                                    onChange={e => { setSelectedItem(e ? e.value : "") }}
                                />
                                <div className="flex items-center justify-center">
                                    <button type="reset" className='orderBtnAdd ml-1' onClick={e => handleAddItem(selectedItem)}>Add</button>
                                </div>
                            </div>
                        </form>
                    </fieldset> */}
                    <table style={{ width: '100%' }} className="diplayTable">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}></th>
                                <th style={{ width: '200px' }}>Functionality</th>
                                <th style={{ width: '50px' }}>
                                    View
                                    <input id='canView' type='checkbox' onChange={toggleAllVerticle}/>
                                </th>
                                <th style={{ width: '50px' }}>
                                    Insert
                                    <input id='canInsert' type='checkbox' onChange={toggleAllVerticle}/>
                                </th>
                                <th style={{ width: '50px' }}>
                                    Update
                                    <input id='canUpdate' type='checkbox' onChange={toggleAllVerticle}/>
                                </th>
                                <th style={{ width: '50px' }}>
                                    Drop
                                    <input id='canDelete' type='checkbox' onChange={toggleAllVerticle}/>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                functionalities.map((functionality) => {
                                    return (
                                        <tr key={'tr'+functionality._id}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    id={functionality._id}
                                                    type='checkbox'
                                                    onChange={toggleAllHorizontal}
                                                />
                                            </td>
                                            <td>{functionality.label}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    id={`sub-${functionality._id}-canView`}
                                                    type='checkbox'
                                                    checked={hasRight(functionality._id, 'canView')}
                                                    disabled={!functionality.view}
                                                    onChange={onChange}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    id={`sub-${functionality._id}-canInsert`}
                                                    type='checkbox'
                                                    checked={hasRight(functionality._id, 'canInsert')}
                                                    disabled={!functionality.insert}
                                                    onChange={onChange}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    id={`sub-${functionality._id}-canUpdate`}
                                                    type='checkbox'
                                                    checked={hasRight(functionality._id, 'canUpdate')}
                                                    disabled={!functionality.update}
                                                    onChange={onChange}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    id={`sub-${functionality._id}-canDelete`}
                                                    type='checkbox'
                                                    checked={hasRight(functionality._id, 'canDelete')}
                                                    disabled={!functionality.drop}
                                                    onChange={onChange}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className='mt-2 items-center'>
                        <label className="text-sm mr-2" htmlFor="flexCheckDefault">Enabled</label>
                        <input type='checkbox' id='isEnabled' className="h-4 w-4" value='' checked={isEnabled} onChange={onChange} />
                    </div>
                    <label className='dialogError'>{errMsg}</label>
                </div>
            </DialogContent>
            <DialogActions>
                <div className='text-center w-full pb-3'>
                    <button className='dialogBtnSave ml-1 pc-diallogbtn' onClick={handleFormSubmit}>Save</button>
                    <button className='dialogBtnCancle ml-1 pc-dialsavebtn' onClick={handleClose}>Cancle</button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default AddRole