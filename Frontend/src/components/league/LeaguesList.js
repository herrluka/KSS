import {Link} from "react-router-dom";

function LeaguesList(props) {
    return (
        <div className="container-fluid align-content-center overflow-auto mb-5 w-50">
            {props.leagues.map(league => {
                return (
                    <div key={league.id} className="text-center">
                        <h5>
                            <Link to={"leagues/" + league.id}>{league.naziv_lige}</Link>
                        </h5>
                    </div>
                )
            })}
        </div>
    )
}

export default LeaguesList;