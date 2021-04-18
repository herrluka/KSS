import {Link} from "react-router-dom";

function RefereeListAdmin(props) {
    return (
        <div className="container-fluid justify-content-center mt-5 text-center w-75">
            <table className="table">
                <thead className="bg-primary">
                <tr>
                    <th className="text-light" scope="col">Ime</th>
                    <th className="text-light" scope="col">Prezime</th>
                    <th className="text-light" scope="col">Najviša liga</th>
                    <th className="text-light" scope="col">Operacije</th>
                </tr>
                </thead>
                <tbody>
                {props.referees.map(referee => {
                    return (
                        <tr key={referee.id}>
                            <td>{referee.ime}</td>
                            <td>{referee.prezime}</td>
                            <td><Link to={"/leagues/" + referee.liga.id} className="text-dark">{referee.liga.naziv_lige}</Link></td>
                            {props.isAdmin?
                                <td className="text-center">
                                    <Link to={'/referees/' + referee.id} className="btn btn-success" >
                                        Više detalja
                                    </Link>
                                </td>
                                :null}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default RefereeListAdmin;