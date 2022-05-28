import { useState } from "react"
import Select from 'react-select';
import NumberFormat from "react-number-format";
import Helper from "../../helper/Helper";

const OpenOrder = ({ data, itemData, payType, setPayType, addItemToOrder, handleRemoveItem, handleDecrese, onBlur, handleCloseOrder }) => {
    let { _id, date, orderNumber, tableNames, items, grossAmount, tipToWaiter, netAmount, userName } = data;
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    // console.log(data);

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
            addItemToOrder(_id, item);
            setQuantity("");
            setSelectedItem("");
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            if (form.elements[index + 1]) {
                form.elements[index + 1].focus();
            }
            else {
                form.elements[0].focus();
            }
        }
    }

    return (
        <div className="" >
            <div className="flex items-center justify-between">
                <label><b>Order Number : </b>{orderNumber}</label>
                <label><b>Order Date : </b>{Helper.GetFormatedDate(date)}</label>
            </div>
            <div className="pt-2">
                <label><b>Tables : </b>{tableNames.join(', ')}</label>
            </div>
            <fieldset className="orderFieldSet">
                <legend>Add Item</legend>
                <form action="" method="">
                    <div className="flex items-center ">
                        <Select
                            autoFocus
                            id="itemSelect"
                            isClearable
                            backspaceRemovesValue
                            escapeClearsValue
                            placeholder="Select Item"
                            className="reactSelect"
                            classNamePrefix="reactSelect"
                            options={itemData}
                            value={Helper.setComboboxValue(itemData, selectedItem)}
                            // onChange={e => { window.alert(e.value) }}
                            onChange={e => { setSelectedItem(e ? e.value : "") }}
                        />
                        <NumberFormat
                            id="itemQty"
                            style={{ marginLeft: '5px', minHeight: '38px', width: '50px' }}
                            placeholder="Qty"
                            className="textBox"
                            thousandsGroupStyle="lakh"
                            decimalSeparator="."
                            displayType="input"
                            type="text"
                            thousandSeparator={true}
                            allowNegative={false}
                            decimalScale={0}
                            maxLength="3"
                            value={quantity}
                            onValueChange={e => { setQuantity(e.value) }}
                        />
                        <div className="flex items-center justify-center">
                            <button type="reset" className='orderBtnAdd ml-1' onClick={handleAddItem}>Add</button>
                        </div>
                    </div>
                </form>
            </fieldset>

            <table style={{ width: '100%' }} className="diplayTable">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }}>Sr</th>
                        <th>Item</th>
                        <th style={{ width: '50px' }}>Qty</th>
                        <th style={{ width: '100px' }}>Rate</th>
                        <th style={{ width: '100px' }}>Amount</th>
                        <th style={{ width: '80px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((item, index) => {
                            const itemid = item.itemId;
                            return (
                                <tr key={item.itemId}>
                                    <td>{index + 1}</td>
                                    <td>{Helper.GetLabelFromValue(itemData, itemid)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {item.quantity}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {Helper.GetFormatedAmount(item.rate)}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {Helper.GetFormatedAmount(item.amount)}
                                    </td>
                                    <td>
                                        <div className="flex justify-between">
                                            <button className="focus:outline-none pl-1" onClick={(e) => handleDecrese(_id, item.itemId)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 24">
                                                    <path d="M0 10h24v4h-24z" />
                                                </svg>
                                            </button>
                                            <button className="focus:outline-none pr-1" onClick={(e) => handleRemoveItem(_id, item.itemId)}>
                                                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Total</th>
                        <th style={{ textAlign: 'right', paddingRight: '5px' }}>{Helper.GetFormatedAmount(grossAmount)}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: 'right', paddingRight: '5px' }}>Tip</td>
                        <td style={{ textAlign: 'right', paddingRight: '5px' }}>
                            <NumberFormat
                                id="tipToWaiter"
                                style={{ marginLeft: '5px', minHeight: '', width: '70px' }}
                                placeholder="Tip"
                                className="textBox"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={0}
                                maxLength="5"
                                value={tipToWaiter}
                                // onValueChange={e => { onChange(_id, e.target.value) }}
                                onBlur={e => { onBlur(_id, e.target.value) }}
                            />
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Net Total</th>
                        <th style={{ textAlign: 'right', paddingRight: '5px' }}>{Helper.GetFormatedAmount(netAmount)}</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
            <div>

            </div>
            <div className="flex pt-4 justify-between">
                <label><b>Last Updated By : </b>{userName}</label>
                <div>
                    <label className="mr-1">Payment Receive Through</label>
                    <select id="categoryId" className='select' style={{ height: '40px' }} value={payType} onChange={(e) => setPayType(e.target.value)}>
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                        <option value="UPI">UPI</option>
                    </select>
                    <button className='orderBtnAdd ml-1' style={{ height: '40px' }} onClick={(e) => handleCloseOrder(data, false)}>Close Order</button>
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default OpenOrder