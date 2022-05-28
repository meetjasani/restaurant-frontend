import React, { useState } from 'react'
import NumberFormat from "react-number-format";


const InvoiceBilling = () => {

    const [date, setDate] = useState(new Date())
    return (
        <div className='container mx-auto invoice-billing'>
            <div className='invoicebilling-title flex items-center justify-between'>
                <h1 className='pl-5 pr-5 pt-12 pb-12 text-5xl text-white uppercase'>Shree Resturant</h1>
            </div>

            <div className='invoiceBilling-details p-12'>
                <div className='flex items-center justify-between'>

                    <div className='client-details'>
                        <div className='flex ml-14  '>
                            <label className='mr-5'><b> Address :</b></label>
                            <p> 1 Company Address <br /> city.state.country <br /> ZIP CODE</p>
                        </div>
                        <div className='flex items-center mt-5'>
                            <label className='mr-5'> <b>Contact :</b> </label>
                            <p>000-000-000-00</p>
                        </div>
                    </div>

                    <div className='billing-content flex items-center justify-between'>
                        <div className='mr-5 '>
                            <div className='mb-5 flex items-center'>
                                <label className='font-bold text-base mr-5'>Invoice Number :</label>
                                <p> 00000 </p>
                                {/* <NumberFormat
                                    placeholder="enter invoice number"
                                    decimalSeparator="."
                                    className="textBox"
                                    displayType="input"
                                    type="text"
                                    thousandSeparator={true}
                                    allowNegative={false}
                                /> */}
                            </div>
                            <div className='mb-5 flex items-center'>
                                <label className='font-bold text-base'>Invoice Date :</label>
                                <p>15/03/2022</p>
                                {/* <DatePicker
                                    value={date}
                                    onChang={setDate}
                                    name="start_date"
                                    dateFormat="DD.MM.YYYY"
                                    placeholder="DD.MM.YYYY"
                                /> */}
                            </div>
                        </div>
                        <div>
                            <div className='mb-5  flex items-center justify-between'>
                                <label className='font-bold text-base mr-5'>Customer Name :</label>
                                <input
                                    id="custName"
                                    className='textBox'
                                    style={{ width: '180px' }}
                                    type='text'
                                    placeholder='Customer Name'
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <label className='font-bold text-base'>Customer GST No :</label>
                                <input
                                    id="custGstNo"
                                    className='textBox'
                                    type='text'
                                    placeholder='GST Number'
                                    maxLength={15}
                                    style={{ width: '180px', textTransform: 'uppercase' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='border-bottom mt-12'></div>

                <div className='mt-12 billing-table diplayTable-custom'>
                    <table className='invoice-billing-table w-full table-content'>
                        <thead>
                            <tr>
                                <th>sr</th>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td>Adad Dala</td>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td style={{ textAlign: "center" }}> $70</td>
                                <td style={{ textAlign: "center" }}> $70</td>
                            </tr>

                            <tr>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td>Mix Vegitable</td>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td style={{ textAlign: "center" }}> $150</td>
                                <td style={{ textAlign: "center" }}> $150</td>
                            </tr>
                        </tbody>
                        <tfoot>

                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "center", fontWeight: "bold", color: "#ff6877" }}>Total :</td>
                                <td style={{ textAlign: "center" }}> $220</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}>SGST(%) :</td>
                                <td style={{ textAlign: "center" }}> $5</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}>CGST(%) :</td>
                                <td style={{ textAlign: "center" }}> $5</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "center", fontWeight: "bold", color: "#000" }}>IGST(%) :</td>
                                <td style={{ textAlign: "center" }}> $0</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}></td>
                                <td></td>
                                <td></td>
                                <td style={{ textAlign: "center", fontWeight: "bold", color: "#ff6877" }}>Net Amount :</td>
                                <td style={{ textAlign: "center" }}> $230</td>
                            </tr>

                        </tfoot>
                    </table>
                </div>

                <div className='mt-10 flex items-center justify-between'>
                    <div className="grid grid-cols-3 gap-2" style={{ maxWidth: "400px", width: "100%s" }} >
                        <div><b>SGST(%)</b></div>
                        <div><b>CGST(%)</b></div>
                        <div><b>IGST(%)</b></div>
                        <div>
                            <NumberFormat
                                id="sgstRate"
                                style={{ marginLeft: '0px', width: '77px', marginTop: '0px' }}
                                placeholder="SGST(%)"
                                className="textBox"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="5"

                            />
                        </div>
                        <div>
                            <NumberFormat
                                id="cgstRate"
                                style={{ marginLeft: '1px', width: '77px', marginTop: '0px' }}
                                placeholder="CGST(%)"
                                className="textBox"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="5"

                            />
                        </div>
                        <div>
                            <NumberFormat
                                id="igstRate"
                                style={{ marginLeft: '1px', width: '77px', marginTop: '0px' }}
                                placeholder="IGST(%)"
                                className="textBox"
                                thousandsGroupStyle="lakh"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={2}
                                maxLength="5"
                            />
                        </div>
                    </div>
                    <div className='noPrintButton'>
                        <button type='button' className='orderBtnAdd' style={{ width: '75px', height: '35px' }}>Update</button>
                        <button type='button' className='orderBtnAdd ml-2' style={{ width: '130px', height: '35px' }} >Print</button>
                    </div>
                </div>




            </div>


        </div >
    )
}

export default InvoiceBilling