import {Link} from "react-router-dom";

function LeagueListForAdmin(props) {
    return (
        <div className="container-fluid text-center align-content-center overflow-auto mb-5 w-50">
            {props.leagues.map(league => {
                return (
                    <div key={league.id} className="d-flex text-center justify-content-between align-content-center">
                        <h5><Link to={"leagues/" + league.id}>{league.naziv_lige}</Link></h5>
                        <div>
                            <button className="btn btn-primary"
                                    onClick={() => props.openEditDialogEvent(league.id, league.naziv_lige, league.rang)}>
                                Uredi</button>
                            <button className="btn btn-danger" onClick={() => props.openDeleteDialogEvent(league.id)}>
                                Izbriši
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default LeagueListForAdmin;