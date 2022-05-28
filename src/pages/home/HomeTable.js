import { useEffect, useState } from "react";
import { ApiGet } from '../../helper/API/ApiData';
import DashboardTable from '../../component/Dashboard/DashboardTable';

const HomeTable = () => {
    const [tableData, SetTableData] = useState([]);

    const setAvailableTableData = () => {
        ApiGet('table/a')
            .then((res) => {
                SetTableData(res);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        setAvailableTableData();
    }, [])

    return (
        <>
            {/* <h1 className="pageHeader">Dashboard</h1> */}
            <DashboardTable
                tableData={tableData}
            />
        </>
    )
}

export default HomeTable