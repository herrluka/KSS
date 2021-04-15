
function ClubsListForAdmin(props) {
    return (
        <div className="container-fluid justify-content-center mt-5 text-center w-100">
            <table className="table">
                <thead className="bg-primary">
                <tr className="text-center">
                    <th className="text-light" scope="col">Naziv</th>
                    <th className="text-light" scope="col">Godina osnivanja</th>
                    <th className="text-light" scope="col">Adresa</th>
                    <th className="text-light" scope="col">Broj telefona</th>
                    <th className="text-light" scope="col">Operacije</th>
                </tr>
                </thead>
                <tbody>
                {props.clubs.map(_club => {
                    return (
                        <tr key={_club.id}>
                            <td>{_club.naziv_kluba}</td>
                            <td>{_club.godina_osnivanja}</td>
                            <td>{_club.adresa_kluba}</td>
                            <td>{_club.broj_telefona}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => props.openEditDialogEvent(_club.id, _club.naziv_kluba,
                                                                                 _club.godina_osnivanja, _club.adresa_kluba,
                                                                                _club.broj_telefona)}>
                                    Uredi
                                </button>
                                <button className="btn btn-danger" onClick={() => props.openDeleteDialogEvent(_club.id)}>Obriši</button>
                            </td>
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </div>
    )
}

export default ClubsListForAdmin;