import Helper from "../../helper/Helper";

const AvailableItems = ({ data }) => {

    return (
        <div className="diplayTable-custom p-4">
            <div className="tablemain-title">
                <h3>Available Items</h3>
            </div>
            <table className="">
                <thead className="text-left">
                    <tr className="header">
                        {/* <th className="w-1/5">Sr</th> */}
                        <th className="w-3/5">Name</th>
                        <th className="w-1/5">Price</th>
                    </tr>
                </thead>
                {
                    data.map((row, index) => {
                        return (
                            index === 0 ?
                                <tbody key={`grp${index}`}>
                                    <tr key={`grp${index}`}>
                                        <td className="diplayTableGroup">
                                            {row.subCategoryName}
                                        </td>
                                    </tr>
                                    <tr className="table-content" key={`item${index}`}>
                                        <td className="flex items-center product-info">
                                            <img src="/images/pro.jpg" alt="" />  {row.name}
                                        </td>
                                        <td >
                                            {Helper.GetFormatedAmount(row.price)}
                                        </td>
                                    </tr>


                                </tbody>
                                :
                                row.subCategoryName !== data[index - 1].subCategoryName ?
                                    <tbody key={`grp${index}`}>
                                        <tr key={`grp${index}`}>
                                            <td className="diplayTableGroup">
                                                {row.subCategoryName}
                                            </td>
                                        </tr>
                                        <tr className="table-content" key={`item${index}`}>
                                            <td className="flex items-center product-info">
                                                <img src="/images/pro.jpg" alt="" />  {row.name}
                                            </td>
                                            <td >
                                                {Helper.GetFormatedAmount(row.price)}
                                            </td>
                                        </tr>
                                    </tbody>
                                    :
                                    <tbody key={`grp${index}`}>
                                        <tr className="table-content" key={`item${index}`}>
                                            <td className="flex items-center product-info">
                                                <img src="/images/pro.jpg" alt="" />  {row.name}
                                            </td>
                                            <td >
                                                {Helper.GetFormatedAmount(row.price)}
                                            </td>
                                        </tr>
                                    </tbody>

                        )
                    })
                }
            </table>
        </div>
    )
}

export default AvailableItems