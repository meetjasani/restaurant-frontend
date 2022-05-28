import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NumberFormat from "react-number-format";

const AddItem = ({ open, handleClose, data, categories, subCategories, onChange, handleFormSubmit, errMsg }) => {
    const { _id, name, categoryId, subCategoryId, price, description, isAvailable } = data;
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {!_id ? 'Add ' : 'Update '}Item
            </DialogTitle>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <div className='flex flex-col'>
                    <input id="name" autoFocus={true} className='textBox pc-textboxname mb-1' type='text' placeholder='Item Name' value={name} onChange={onChange} />
                    <select id="categoryId" className='select pc-textboxname mb-4' value={categoryId} onChange={onChange}>
                        <option value="">Select Category</option>
                        {
                            categories.map((row) => {
                                return (
                                    <option key={row._id} value={row._id}>{row.name}</option>
                                )
                            })
                        }
                    </select>
                <select id="subCategoryId" className='select pc-textboxname mb-2' value={subCategoryId} onChange={onChange}>
                        <option value="">Select Subcategory</option>
                        {
                            subCategories.map((row) => {
                                return (
                                    <option key={row._id} value={row._id}>{row.name}</option>
                                )
                            })
                        }
                    </select>
                    <NumberFormat
                        className='textBox pc-textboxname mb-2'
                        // className='px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 focus:bg-white focus:border-blue-600 focus:outline-none w-3/4'
                        placeholder="Price"
                        thousandsGroupStyle="lakh"
                        value={price}
                        decimalSeparator="."
                        displayType="input"
                        type="text"
                        thousandSeparator={true}
                        allowNegative={false}
                        decimalScale={2}
                        id="price"
                        onChange={(e) => { onChange(e) }}
                    // onValueChange={e => { onChange({ id: "price", value: e.value }) }}
                    />
                    <textarea id="description" className='textBox pc-textboxname mb-4 ' placeholder='Description' value={description} onChange={onChange} />
                    <input id="itemImg" type="file" onChange={onChange} />
                    <div className='mt-2 align-middle'>
                        <label className="text-sm mr-2" htmlFor="flexCheckDefault">Entry Enabled</label>
                        <input type='checkbox' id='isAvailable' className="h-4 w-4" value='' checked={isAvailable} onChange={onChange} />
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

export default AddItem