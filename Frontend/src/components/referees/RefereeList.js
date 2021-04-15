import {Link} from "react-router-dom";

function RefereeList(props) {
    return (
        <div className="container-fluid justify-content-center mt-5 text-center w-75">
            <table className="table">
                <thead className="bg-primary">
                <tr>
                    <th className="text-light" scope="col">Ime</th>
                    <th className="text-light" scope="col">Prezime</th>
                    <th className="text-light" scope="col">Najviša liga</th>
                </tr>
                </thead>
                <tbody>
                {props.referees.map(referee => {
                    return (
                        <tr key={referee.id}>
                            <td>{referee.ime}</td>
                            <td>{referee.prezime}</td>
                            <td><Link to={"/leagues/" + referee.liga.id} className="text-dark">{referee.liga.naziv_lige}</Link></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default RefereeList;