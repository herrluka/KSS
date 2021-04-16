import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";

function MatchesHeader(props) {
    return (
        <div className="text-center my-4">
            <h1>{props.round.leagueName}</h1>
            <h2 className="mt-3 font-weight-bold">{props.round.roundName}</h2>
            <div className="m-5 text-center">
                <button className="btn btn-success" onClick={() => props.setDialogShownEvent()}>
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj utakmicu
                    </div>
                </button>
            </div>
        </div>
    )
}

export default MatchesHeader;