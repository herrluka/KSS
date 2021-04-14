import {Link} from "react-router-dom";

function LeaguesHeader(props) {
    return (
        <>
            <h1 className="text-center pt-4 mb-5">Lige KSS-a</h1>
            <div className="container-fluid text-center align-content-center overflow-auto mb-5">
                {props.leagues.map(league => {
                    return (
                        <h5><Link to={"leagues/" + league.id}>{league.naziv_lige}</Link></h5>
                    )
                })}
            </div>
        </>
    )
}

export default LeaguesHeader;