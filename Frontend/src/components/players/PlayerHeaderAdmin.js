import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";

function PlayerHeaderAdmin(props) {
    return (
        <div className="mr-5 m-5 text-center">
            <h1 className="my-5">Igrači</h1>
            <button className="btn btn-success" onClick={() => props.showInsertDialogEvent()}>
                <div className="d-flex">
                    <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj igrača
                </div>
            </button>
        </div>
    )
}

export default PlayerHeaderAdmin;