
function ClubsList(props) {
    return (
        <div className="container-fluid justify-content-center mt-5 text-center w-75">
            <table className="table">
                <thead className="bg-primary">
                <tr className="text-center">
                    <th className="text-light" scope="col">Naziv</th>
                    <th className="text-light" scope="col">Godina osnivanja</th>
                    <th className="text-light" scope="col">Adresa</th>
                    <th className="text-light" scope="col">Broj telefona</th>
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
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </div>
    )
}

export default ClubsList;