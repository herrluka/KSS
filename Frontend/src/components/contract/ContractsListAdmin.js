function ContractsListAdmin(props) {
    return (
        <div className="d-flex justify-content-center">
            <table className="table w-50 text-center">
                <thead className="bg-primary">
                <tr>
                    <th className="text-light" scope="col">Ime</th>
                    <th className="text-light" scope="col">Prezime</th>
                    <th className="text-light" scope="col">Datum ugovora</th>
                    <th className="text-light" scope="col">Operacije</th>
                </tr>
                </thead>
                <tbody>
                {props.contracts.map(contract => {
                    return (
                        <tr key={contract.id}>
                            <td>{contract.ime}</td>
                            <td>{contract.prezime}</td>
                            <td>{contract.datum_angazovanja}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => props.openDeleteDialog(contract.id)}>Obriši</button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default ContractsListAdmin