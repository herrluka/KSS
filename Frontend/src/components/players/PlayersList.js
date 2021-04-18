import {Link} from "react-router-dom";

function PlayersList(props) {
    return(
        <div className="container-fluid justify-content-center mt-5 text-center w-75">
            {props.isContentLoaded?
                <table className="table">
                    <thead className="bg-primary">
                    <tr>
                        <th className="text-light" scope="col">Ime</th>
                        <th className="text-light" scope="col">Prezime</th>
                        <th className="text-light" scope="col">Datum rodjenja</th>
                        {props.isAdmin?<th className="text-light" scope="col">Operacije</th>:null}
                    </tr>
                    </thead>
                    <tbody>
                    {props.players.map(player => {
                        return (
                            <tr key={player.id}>
                                <td>{player.ime}</td>
                                <td>{player.prezime}</td>
                                <td>{player.datum_rodjenja}</td>
                                {props.isAdmin?<td className="text-center">
                                    <Link to={'players/' + player.id} className="btn btn-success">
                                        Više detalja
                                    </Link>
                                </td>:null}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                :
                null
            }
        </div>
    )
}

export default PlayersList;
