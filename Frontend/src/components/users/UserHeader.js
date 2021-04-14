import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";

function UserHeader(props) {
    return (
        <>
            <h1 className="text-center pt-4 mb-5">Korisnici</h1>
            <div className="mr-5 m-5 text-center">
                <Link to="/register" className="btn btn-success">
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj korisnika
                    </div>
                </Link>
            </div>
        </>
    )
}

export default UserHeader;