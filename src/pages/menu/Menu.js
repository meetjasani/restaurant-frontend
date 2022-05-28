import React, { useContext } from 'react'
import Helper from "../../helper/Helper";
import { useEffect, useState } from "react";
import { ApiGet } from "../../helper/API/ApiData";
import { SocketContext } from '../../SocketContext';

const Menu = ({ }) => {
    const [data, SetData] = useState([]);
    const { socket } = useContext(SocketContext);

    const setItemData = () => {
        ApiGet('item/a').then((res) => {
            SetData(res);
        })
    }

    useEffect(() => {
        setItemData();
        socket.connect();
        socket.on('connect', () => {
            socket.on("availableItem", (serverMsg) => { setItemData() })
        })
        return () => socket.disconnect();
    }, [])

    return (
        <>
            <h1 className='pageHeader'>  Menu </h1>
            <div className='diplayTable-custom p-4'>
                <div className='tablemain-title'>
                    <h3>Product List</h3>
                </div>
                <table className='w-full menulist-table'>
                    <thead>
                        <div className="mt-2 mb-2"></div>
                        <tr>
                            <th style={{ width: '70px', minWidth:'70px'}}>name</th>
                            <th style={{ width: '100px', minWidth:'100px'}}> Image </th>
                            <th style={{ width: '100px', minWidth:'100px'}}> Price </th>
                            <th style={{ width: '100px', minWidth:'100px'}}> Subcategory </th>
                            <th style={{ width: '100px', minWidth:'100px'}}> category </th>
                            <th style={{ width: '100px', minWidth:'100px'}}> Action </th>
                        </tr>
                        <div className="mt-2 mb-2"></div>
                    </thead>
                    <tbody>
                        {
                            data.map((row, index) => {
                                // console.log(data, "data")
                                return (
                                    <>
                                        <tr className='text-center'>
                                            <td className='pc-wrapsec'> {row.name} </td>
                                            <td>
                                                <img
                                                    src={process.env.REACT_APP_IMAGE_URL + row.itemImg === "" ? "./images/Chef-restaurant.jpg" : process.env.REACT_APP_IMAGE_URL + row.itemImg}
                                                    alt="" className='w-20 h-20 rounded-xl mx-auto' />
                                            </td>
                                            <td>  {Helper.GetFormatedAmount(row.price)} </td>
                                            <td>{row.subCategoryName} </td>
                                            <td>{row.categoryName} </td>
                                            <td>
                                                <button
                                                    className='cursor-pointer text-red-600'
                                                > Click </button>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>



        </>
    )
}

export default Menu