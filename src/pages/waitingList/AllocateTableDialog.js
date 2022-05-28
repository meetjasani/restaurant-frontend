import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AvailableTable from '../../component/Dashboard/AvailableTable';

const AllocateTableDialog = ({ open, handleClose, tableData, selectedTable, setIsPartialAllocation, canInsertOrder, onChangeTableSelection, handleTableSubmit }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent style={{ paddingBottom: '1px' }}>
                <AvailableTable
                    data={tableData}
                    selected={selectedTable}
                    partialEnabled={true}
                    setIsPartialAllocation={setIsPartialAllocation}
                    canInsertOrder={canInsertOrder}
                    onChange={onChangeTableSelection}
                    handleTableSubmit={handleTableSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AllocateTableDialog