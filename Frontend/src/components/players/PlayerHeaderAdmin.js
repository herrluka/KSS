import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";

function PlayerHeaderAdmin(props) {
    return (
        <>
            <h1 className="text-center pt-4 mb-5">Igrači</h1>
            <div className="text-center mb-4">
                <button className="btn btn-success" onClick={() => props.showInsertDialogEvent()}>
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj igrača
                    </div>
                </button>
            </div>
        </>
    )
}

export default PlayerHeaderAdmin;