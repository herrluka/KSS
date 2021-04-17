import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";

function ContractHeader(props) {
    return (
        <>
            <h1 className="text-center my-5">{props.clubName}</h1>
            <div className="mr-5 m-5 text-center">
                <button className="btn btn-success" onClick={() => props.openDialog()} >
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Angažuj igrača
                    </div>
                </button>
            </div>
        </>
    )
}

export default ContractHeader;