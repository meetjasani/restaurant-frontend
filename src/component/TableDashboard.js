import { Box } from "@mui/material"
import DashboardTable from "./Dashboard/DashboardTable";


const TableDashboard = ({ tableData }) => {

    return (
        <>
            <div className="flex">
                <Box sx={{ width: '100%' }}>
                    <DashboardTable tableData={tableData} />
                </Box>
            </div >
        </>
    )
}

export default TableDashboard