import {connect} from "react-redux";
import roles from "../../constants";
import {useEffect, useState} from "react";
import {getAllReferees, insertReferee} from "./RefereeService";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import CreateRefereeDialog from "./CreateRefereeDialog";
import {getAllLeagues} from "../league/LeagueService";
import RefereeList from "./RefereeList";
import RefereeListAdmin from "./RefereeListAdmin";
import RefereeHeaderForAdmin from "./RefereeHeaderForAdmin";
import RefereeHeader from "./RefereeHeader";
import {createErrorAlert, createSuccessAlert} from "../../alertHelper";


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

    function fetchReferees() {
        getAllReferees().then(response => {
            setFetchedReferees(response.data.content);
            setShownReferees(response.data.content);
            setFetchedFromServer(true);
        }).catch(error => {
            setServerErrorOccured(true);
        }).finally(() => {
            setLoaderShown(false);
        })
    }

    function fetchLeagues() {
        getAllLeagues().then(response => {
            setExistingLeagues(response.data.content);
            fetchReferees();
        }).catch(error => {
            setServerErrorOccured(true);
        })
    }

    function retryFetchingData() {
        setFetchedFromServer(false);
        setServerErrorOccured(false);
        setLoaderShown(true);
        if (props.isAdmin) {
            if (existingLeagues.length === 0) {
                fetchLeagues();
            } else {
                fetchReferees();
            }
        } else {
            fetchReferees();
        }
    }

    useEffect(() => {
        if (props.isAdmin) {
            fetchLeagues();
        } else {
            fetchReferees();
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
            createSuccessAlert("Sudija sa??uvan");
            setDialogShown(false);
            setRefereeInDialog(refereeInDialogInitialState);
            fetchReferees();
        }).catch(error => {
            createErrorAlert("Sudija nije sa??uvan")
        }).finally(() => {
            setLoaderShown(false);
        })
    }

    if (isServerErrorOccurred) {
        return <RetryError retry={() => retryFetchingData()} isActive={true} />
    }
    if (!isFetchedFromServer) {
        return <ModalLoader isActive={isLoaderShown} />
    }

    if (props.isAdmin) {
        return (
            <>
                <ModalLoader isActive={isLoaderShown} />
                <RefereeHeaderForAdmin searchReferees={(searchText) => {searchReferees(searchText)}}
                                       setDialogShownEvent={() => setDialogShown(!isDialogShown)} />
                <RefereeListAdmin referees={shownReferees} isAdmin={props.isAdmin}/>
                <CreateRefereeDialog isDialogShown={isDialogShown} referee={refereeInDialog}
                                     closeDialog={() => setDialogShown(!isDialogShown)}
                                     onInputChange={(event) => handleChange(event)}
                                     onValidateForm={(event) => insertNewReferee(event)}
                                     availableLeagues={existingLeagues}
                />
            </>
        )
    } else {
        return (
            <>
                <ModalLoader isActive={isLoaderShown} />
                <RefereeHeader searchReferees={(searchText) => {searchReferees(searchText)}}
                               setDialogShownEvent={() => setDialogShown(!isDialogShown)} />
                <RefereeList referees={shownReferees} />
            </>
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