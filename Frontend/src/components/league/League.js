import { useEffect, useState } from 'react';
import { getAllLeagues, createLeague, updateLeague, deleteLeague } from "./LeagueService";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import LeagueDialog from "./LeagueDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import LeaguesListForAdmin from "./LeaguesListForAdmin";
import LeaguesHeaderForAdmin from "./LeaguesHeaderForAdmin";
import LeaguesHeader from "./LeaguesHeader";
import LeaguesList from "./LeaguesList";


function League(props) {

    const [leagues, setLeagues] = useState([]);
    const [loaderActive, setLoaderActive] = useState(true);
    const [isContentLoaded, setContentLoaded] = useState(false);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
    const [deleteDialogLeagueId, setDeleteDialogLeagueId] = useState(null);
    const [leagueInDialog, setLeagueInDialog] = useState({
        id: '',
        name: '',
        rank: ''
    });
    const [dialogMode, setDialogMode] = useState('');
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});

    function fetchData() {
        getAllLeagues().then(_leagues => {
            setLeagues(_leagues.data.content);
            setContentLoaded(true);
        }).catch(error => {
            setServerErrorOccurred(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    function retryGettingLeagues() {
        setLoaderActive(true);
        setServerErrorOccurred(false);
        fetchData();
    }

    function handleChange(event) {
        setLeagueInDialog({
            ...leagueInDialog,
            [event.target.name]: event.target.value
        })
    }

    function openEditDialog(_id, _name, _rank) {
        setLeagueInDialog({
            id: _id,
            name: _name,
            rank: _rank
        });
        setDialogMode('EDIT');
        setDialogShown(!isDialogShown);
    }

    function openCreateDialog() {
        setDialogMode('CREATE');
        setLeagueInDialog({
            id: null,
            name: '',
            rank: ''
        });
        setDialogShown(!isDialogShown);
    }

    function openDeleteDialog(leagueId) {
        setDeleteDialogLeagueId(leagueId);
        setDeleteDialogShown(!isDeleteDialogShown);
    }

    function showSuccessAlert() {
        setSuccessAlertStyle({display: "block", animation: "slideToLeft 2s", zIndex: "1300"});
        setTimeout(() => {
            setSuccessAlertStyle({display: "block", animation: "slideToRight 2s", zIndex: "1300"});
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

    function saveNewLeague(event) {
        event.preventDefault();
        setLoaderActive(true);
        createLeague(leagueInDialog, props.token).then(response => {
            setDialogShown(false);
            showSuccessAlert();
            retryGettingLeagues();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        });
    }

    function updateExistingLeague(event) {
        event.preventDefault();
        setLoaderActive(true);
        updateLeague(leagueInDialog.id, {
            name: leagueInDialog.name,
            rank: leagueInDialog.rank
        }, props.token).then(response => {
            setDialogShown(false);
            showSuccessAlert();
            retryGettingLeagues();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function deleteExistingLeague(id) {
        setLoaderActive(true);
        deleteLeague(id, props.token).then(response => {
            showSuccessAlert();
            setDeleteDialogShown(false);
            retryGettingLeagues();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        });
    }

    if (serverErrorOccurred) {
        return <RetryError isActive={true} retry={() => retryGettingLeagues()} />
    }

    if (!isContentLoaded) {
       return <ModalLoader isActive={true} />
    }

    if (!props.isAdmin) {
        return (
            <>
                <ModalLoader isActive={loaderActive} />
                <LeaguesHeader leagues={leagues} />
                <LeaguesList leagues={leagues} />
            </>
        )
    }

    return (
        <>
            <ModalLoader isActive={loaderActive} />
            <LeaguesHeaderForAdmin openCreateDialogEvent={() => openCreateDialog()} />
            <LeaguesListForAdmin leagues={leagues}
                                 openEditDialogEvent={(_id, _name, _rank) => openEditDialog(_id, _name, _rank)}
                                 openDeleteDialogEvent={(leagueId) => openDeleteDialog(leagueId)}/>
            <LeagueDialog mode={dialogMode} league={leagueInDialog} isDialogShown={isDialogShown}
                          closeDialog={() => setDialogShown(!isDialogShown)}
                          onInputChange={(event) => handleChange(event)}
                          onValidateCreateForm={(event) => saveNewLeague(event)}
                          onValidateEditForm={(event) => updateExistingLeague(event)}/>
            <DeleteDialog
                id={deleteDialogLeagueId}
                whatToDelete="ligu"
                closeDialog={() => setDeleteDialogShown(!isDeleteDialogShown)}
                isDialogShown={isDeleteDialogShown}
                confirmDelete={(id) => deleteExistingLeague(id)}/>
            <SuccessAlert alertStyle={successAlertStyle} alertText="Liga je ažurirana" />
            <ErrorAlert alertStyle={errorAlertStyle} alertText="Liga nije ažurirana" />
        </>
    )

}
function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token
    }
}

export default connect(mapStateToProps)(League);
