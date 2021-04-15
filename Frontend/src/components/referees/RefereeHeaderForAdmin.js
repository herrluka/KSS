import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import SearchWithoutButton from "../common/search/SearchWithoutButton";

function RefereeHeaderForAdmin(props) {
    return (
        <>
            <h1 className="text-center m-5">Korisnici</h1>
            <div className="m-5 text-center">
                <button className="btn btn-success" onClick={() => props.setDialogShownEvent()}>
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj sudiju
                    </div>
                </button>
            </div>
            <SearchWithoutButton search={(_search_text) => props.searchReferees(_search_text)} searchPlaceholder={"Pretražite sudije po imenu"}/>
        </>
    )
}

export default RefereeHeaderForAdmin;