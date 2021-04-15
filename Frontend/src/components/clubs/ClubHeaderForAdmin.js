import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";

function ClubHeaderForAdmin(props) {
    return (
        <>
            <h1 className="text-center pt-4 mb-5">Klubovi</h1>
            <div className="mr-5 m-5 text-center">
                <button className="btn btn-success" onClick={() => props.openInsertDialog()}>
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj klub
                    </div>
                </button>
            </div>
        </>
    )
}

export default ClubHeaderForAdmin;