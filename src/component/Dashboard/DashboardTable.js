import { useContext, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { CheckboxContext } from "../../CheckboxContext";
const DashboardTable = ({ tableData }) => {

    const { checkbox } = useContext(CheckboxContext);


    const [show, setShow] = useState(false)
    const [tableCheck, setTableCheck] = useState([])
    const [tableArray, setTableArray] = useState([...tableData])

    // console.log("tableArraytableArray", tableArray);

    const heandleClick = () => {
        setShow(!show)
    }

    useEffect(() => {
        setTableArray(tableData)
    }, [tableData])

    // debugger;
    const margeTable = () => {
        // debugger;
        console.log("tableCheck", tableCheck);
        if (tableCheck.length >= 2) {

            let merrageTableArray = [];
            let OldData = tableArray
            setTableArray([])
            console.log("OldData", OldData);
            for (const item of tableCheck) {
                let data = OldData.filter(y => y._id == item);
                merrageTableArray.push(data[0]);
            }

            tableCheck.map(x => {
                let index = OldData.findIndex(obj => obj._id === x._id);;
                OldData.splice(index, 1)
            })

            let capicity = 0
            let name = ''
            let orderStatus = 0
            let sequanceNo = (OldData.length + 1)
            let _id = ''

            for (const x of merrageTableArray) {
                capicity = capicity + x.capicity;
                name = name + "," + x.name;
                orderStatus = orderStatus + x.orderStatus;
                _id = _id + "," + x._id;
            }

            debugger;

            OldData.push({
                capicity: capicity,
                name: name.trimStart(","),
                orderStatus: orderStatus,
                sequanceNo: sequanceNo,
                _id: _id,
            })

            setTableArray(OldData);

        } else {
            alert("Select at list 2 table")
        }
    }

    const handlecheckbox = (e) => {
        const value = e.target.value;
        // _formData[e.target.id] = value;
        setTableCheck([...tableCheck, value]);
    }

    return (
        <>

            <div className='flex  flex-wrap p-3 justify-between'>
                {
                    tableArray?.map((x, i) => (

                        <div id={i} style={{ width: (50 * x.capicity) + "px", marginBottom: '50px', marginRight: "50px" }}>
                            <div className="relative">
                                <div className="flex" style={{ width: (50 * x.capicity) + "px", justifyContent: "space-between", paddingLeft: ((50 * x.capicity) - 45) / x.capicity + 'px', paddingRight: ((50 * x.capicity) - 45) / x.capicity + 'px' }}>
                                    {x.capicity && Array.from(Array(parseInt(x.capicity)).keys()).map((y, i) => (
                                        <>
                                            {((i + 1) % 2 !== 0) && ((i + 1) !== Array.from(Array(parseInt(x.capicity)).keys()).length) &&
                                                (<div>
                                                    <div className='circle '  ></div>
                                                </div>)
                                            }
                                        </>
                                    ))}
                                </div>
                                <div className="flex" style={{ width: (50 * x.capicity) + "px", justifyContent: "space-between", paddingLeft: ((50 * x.capicity) - 45) / x.capicity + 'px', paddingRight: ((50 * x.capicity) - 45) / x.capicity + 'px' }}>
                                    {x.capicity && Array.from(Array(parseInt(x.capicity)).keys()).map((y, i) => (
                                        <>
                                            {((i + 1) % 2 === 0) &&
                                                (<div className="relative" style={{ marginTop: "22px", top: "23px" }}>
                                                    <div className='circle '  ></div>
                                                </div>)
                                            }
                                        </>
                                    ))}
                                </div>

                                {x.capicity && Array.from(Array(parseInt(x.capicity)).keys()).map((y, i) => (
                                    <>
                                        {((i + 1) % 2 !== 0) && ((i + 1) === Array.from(Array(parseInt(x.capicity)).keys()).length) &&
                                            (<div>
                                                <div className='circle absolute' style={{ top: "41%", right: "-22px" }}></div>
                                            </div>)
                                        }
                                    </>
                                ))}
                            </div>
                            < div className='square' style={{ width: (50 * x.capicity) + "px" }}>
                                <div className=" flex items-center">
                                    {checkbox &&
                                        <input
                                            type="checkbox"
                                            value={x._id}
                                            onChange={(e) => handlecheckbox(e)}
                                            className="ml-2"
                                        />
                                    }
                                    <p className="mb-0 ml-2">{x.name}</p>
                                </div>
                            </div>
                        </div>
                    ))

                }

                {checkbox &&
                    <>
                        <button type="button" className='dialogBtnSave ml-1 pc-dialsavebtn' onClick={margeTable}>Marge</button>
                    </>
                }
            </div>
            <div>
                <div>
                    <div className="fixed floating-btn">
                        <button type="button" onClick={heandleClick}>
                            floating
                        </button>
                    </div>
                    {
                        show &&
                        <div className="dashbord-sideber">
                            <div></div>
                        </div>
                    }
                </div>

                <div className='flex items-center badget-main'>
                    <button className='relative ml-12 flex item-center pc-budgetsec'>
                        <span className='absolute span-badget p-1 text-white'> new </span>
                        badget
                    </button>
                    <button className='relative ml-12 flex item-center pc-budgetsec'>
                        <span className='absolute span-badget sec-span-badget p-1 text-white'> new </span>
                        badget
                    </button>
                    <button className='relative ml-12 flex item-center pc-budgetsec'>
                        <span className='theer-span-badget span-badget absolute p-1 text-white'> new </span>
                        badget
                    </button>
                    <button className='relative ml-12 flex item-center pc-budgetsec'>
                        <span className='four-span-badget span-badget absolute p-1 text-white'> new </span>
                        badget
                    </button>
                </div>
            </div>
            <div>
                <img />
            </div>
        </>

    )
}

export default DashboardTable