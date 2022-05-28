import Select from 'react-select';
import Helper from '../../helper/Helper';

const AvailableTable = ({ data, selected, partialEnabled, setIsPartialAllocation, canInsertOrder, onChange, handleTableSubmit }) => {
    let totCapicity = 0;

    return (
        <div className="px-3">
            <div className="diplayTable-custom p-4">
                <div className="tablemain-title">
                    <h3>Available Tables</h3>
                </div>
                <table className="">
                    <thead className="text-left">
                        <tr className="header">
                            <th className="w-1/5"></th>
                            <th className="w-3/5">Table</th>
                            <th className="w-1/5">Capicity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((row, index) => {
                                totCapicity += row.capicity
                                return (
                                    <tr className="table-content" key={row._id}>
                                        <td>
                                            <label className="checkbox-container">
                                                <input type='checkbox' id={row._id} onChange={onChange} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td>
                                            {row.name}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {row.capicity}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr className="tfooter-content">
                            <th>Total</th>
                            <th className="text-left">{selected.length}</th>
                            <th>{totCapicity}</th>
                        </tr>

                    </tfoot>
                </table>
                {
                    partialEnabled ?
                        <>
                            <span>Partial Allocation </span>
                            <input type='checkbox' onChange={e => setIsPartialAllocation(e.target.checked)} />
                        </>
                        : <></>
                }
                <div className="w-full text-center">
                    <button className="dashboardBtn" disabled={!canInsertOrder} onClick={handleTableSubmit}>Occupie Selected</button>
                </div>
            </div>
        </div>
    )
}

export default AvailableTable