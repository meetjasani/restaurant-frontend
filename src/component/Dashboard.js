import { Box } from "@mui/material"
import AvailableItems from "./Dashboard/AvailableItems"
import AvailableTable from "./Dashboard/AvailableTable"
import Helper from "../helper/Helper";


const Dashboard = ({ itemData, tableData, selectedTable, onChangeTableSelection, handleTableSubmit, userData }) => {
    const canInsertOrder = Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.AVAILABLE_TABLES, Helper.CRUD.INSERT) && selectedTable.length > 0

    return (
        <>
            <div className="flex">
                {
                    Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.AVAILABLE_ITEMS, Helper.CRUD.VIEW) ?
                        <Box sx={{ width: '50%' }}>
                            <AvailableItems
                                data={itemData}
                            />
                        </Box>
                        :
                        ""
                }
                {
                    Helper.hasFunctionality(userData, Helper.FUNCTIONALITY.AVAILABLE_TABLES, Helper.CRUD.VIEW) ?
                        <Box sx={{ width: '50%' }}>
                            <AvailableTable
                                data={tableData}
                                selected={selectedTable}
                                partialEnabled={false}
                                canInsertOrder={canInsertOrder}
                                onChange={onChangeTableSelection}
                                handleTableSubmit={handleTableSubmit}
                            />
                        </Box>
                        :
                        ""
                }
            </div>
          
        </>
    )
}

export default Dashboard 