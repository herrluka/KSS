import SearchWithoutButton from "../common/search/SearchWithoutButton";
import {connect} from "react-redux";
import roles from "../../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import RefereeRow from "./RefereeRow";
import {getAllReferees, insertReferee} from "./RefereeService";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import CreateRefereeDialog from "./CreateRefereeDialog";
import {getAllLeagues} from "../league/LeagueService";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";


function Referee(props) {

    const [isServerErrorOccurred, setServerErrorOccured] = useState(false);
    const [isFetchedFromServer, setFetchedFromServer] = useState(false);
    const [isLoaderShown, setLoaderShown] = useState(true);
    const [isDialogShown, setDialogShown] = useState(false);
    const [fetchedReferees, setFetchedReferees] = useState([]);
    const [shownReferees, setShownReferees] = useState([]);
    const [existingLeagues, setExistingLeagues] = useState([]);
    const refereeInDialogInitialState = {
        name: '',
        surname: '',
        address: '',
        phone_number: '',
        league: "selected",
    };
    const [refereeInDialog, setRefereeInDialog] = useState(refereeInDialogInitialState);
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});


    function showSuccessAlert() {
        setSuccessAlertStyle({display: "block", animation: "slideToLeft 2s"});
        setTimeout(() => {
            setSuccessAlertStyle({display: "block", animation: "slideToRight 2s"});
            setTimeout(() => {
                setSuccessAlertStyle({display: "none"});
            }, 500);
        }, 3000);
    }

    function showErrorAlert() {
        setErrorAlertStyle({display: "block", animation: "slideToLeft 0.5s", zIndex: "1300"});
        setTimeout(() => {
            setErrorAlertStyle({display: "block", animation: "slideToRight 0.5s", zIndex: "1300"});
            setTimeout(() => {
                setErrorAlertStyle({display: "none"});
            }, 500);
        }, 3000);
    }

    function fetchReferees() {
        getAllReferees().then(response => {
            setFetchedReferees(response.data.content);
            setShownReferees(response.data.content);
        }).catch(error => {
            setServerErrorOccured(true);
        }).finally(() => {
            setFetchedFromServer(true);
            setLoaderShown(false);
        })
    }

    function fetchLeagues() {
        getAllLeagues().then(response => {
            setExistingLeagues(response.data.content);
        }).catch(error => {
            setServerErrorOccured(true);
        })
    }

    function retryFetchingData() {
        setFetchedFromServer(false);
        setServerErrorOccured(false);
        setLoaderShown(true);
        fetchReferees();
        fetchLeagues();
    }

    useEffect(() => {
            fetchReferees();
        if (props.isAdmin) {
            fetchLeagues();
        }
    }, []);

    function searchReferees(searchText) {
        setShownReferees(fetchedReferees.filter(referee => referee.ime.toLowerCase().startsWith(searchText)));
    }

    function handleChange(event) {
        setRefereeInDialog({
            ...refereeInDialog,
            [event.target.name]: event.target.value
        })
    }

    function insertNewReferee(event) {
        event.preventDefault();
        setLoaderShown(true);
        insertReferee({
            ...refereeInDialog,
            league_id: parseInt(refereeInDialog.league)
        }, props.token).then(response => {
            showSuccessAlert();
            setDialogShown(false);
            setRefereeInDialog(refereeInDialogInitialState);
            fetchReferees();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderShown(false);
        })
    }

    if (isServerErrorOccurred) {
        return <RetryError retry={() => retryFetchingData()} isActive={true} />
    }

    if (isFetchedFromServer) {
        return (
            <div>
                <ModalLoader isActive={isLoaderShown} />
                <SearchWithoutButton search={(_search_text) => searchReferees(_search_text)} searchPlaceholder={"Pretražite sudije po imenu"}/>
                {props.isAdmin?<div className="mr-5 m-5 text-center">
                    <button className="btn btn-success" onClick={() => setDialogShown(!isDialogShown)}>
                        <div className="d-flex">
                            <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj sudiju
                        </div>
                    </button>
                </div>:null}
                <div className="container-fluid justify-content-center mt-5 text-center w-75">
                    <table className="table">
                        <thead className="bg-primary">
                        <tr>
                            <th className="text-light" scope="col">Ime</th>
                            <th className="text-light" scope="col">Prezime</th>
                            <th className="text-light" scope="col">Najviša liga</th>
                        </tr>
                        </thead>
                        <tbody>
                        {shownReferees.map(referee => {
                            return <RefereeRow referee={referee} isAdmin={props.isAdmin} />
                        })}
                        </tbody>
                    </table>
                </div>
                {props.isAdmin?
                <CreateRefereeDialog isDialogShown={isDialogShown} referee={refereeInDialog}
                                     closeDialog={() => setDialogShown(!isDialogShown)}
                                     onInputChange={(event) => handleChange(event)}
                                     onValidateForm={(event) => insertNewReferee(event)}
                                     availableLeagues={existingLeagues}
                                     />
                :null
                }
                <SuccessAlert alertStyle={successAlertStyle} alertText="Sudija je uspešno sačuvan"/>
                <ErrorAlert alertStyle={errorAlertStyle} alertText="Sudija nije sačuvan" />
            </div>
        )
    } else {
        return (
            <ModalLoader isActive={isLoaderShown} />
        )
    }
}

function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token,
    }
}

export default connect(mapStateToProps)(Referee);