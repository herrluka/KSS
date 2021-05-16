import {Link} from "react-router-dom";
import {faBasketballBall} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

function LeaguesList(props) {
    return (
        <div className="container-fluid align-content-center overflow-auto mb-5 text-center">
            {props.leagues.map(league => {
                return (
                    <Link key={league.id} to={"leagues/" + league.id} className="btn btn-dark w-75 m-1 ">
                        <div className="d-flex justify-content-between">
                            <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faBasketballBall} />
                            <span className="h4 m-0">{league.naziv_lige}</span>
                            <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faBasketballBall} />
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default LeaguesList;