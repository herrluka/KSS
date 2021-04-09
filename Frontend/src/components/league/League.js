import { useEffect, useState } from 'react';
import { getAllLeagues, createLeague, updateLeague, deleteLeague } from "./LeagueService";
import ModalLoader from "../common/loaders/ModalLoader";
import {Link} from "react-router-dom";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import LeagueDialog from "./LeagueDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";


function League(props) {

    const [leagues, setLeagues] = useState([]);
    const [loaderActive, setLoaderActive] = useState(true);
    const [retryButtonDisplayed, setRetryButtonDisplayed] = useState(false);
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

    useEffect(() => {
        getAllLeagues().then(_leagues => {
            setLeagues(_leagues.data.content);
        }).catch(error => {
            setRetryButtonDisplayed(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }, []);

    function retryGettingLeagues() {
        setLoaderActive(true);
        setRetryButtonDisplayed(false);
        getAllLeagues().then(_leagues => {
            setLeagues(_leagues.data.content);
        }).catch(error => {
            setRetryButtonDisplayed(true);
        }).finally(() => {
            setLoaderActive(false);
        })
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
        console.log(leagueInDialog);
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

    if (props.isAdmin) {
        return (
            <>
                <ModalLoader isActive={loaderActive} />
                <RetryError isActive={retryButtonDisplayed} retry={() => retryGettingLeagues()} />
                <h1 className="text-center pt-4 mb-5">Lige KSS-a</h1>
                <div className="mr-5 m-5 text-center">
                    <button className="btn btn-success" onClick={() => openCreateDialog()}>
                        <div className="d-flex">
                            <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj ligu
                        </div>
                    </button>
                </div>
                <div className="container-fluid text-center align-content-center overflow-auto mb-5 w-50">
                    {leagues.map(league => {
                        return (
                            <div key={league.id} className="d-flex text-center justify-content-between align-content-center">
                                <h5><Link to={"leagues/" + league.id}>{league.naziv_lige}</Link></h5>
                                <div>
                                    <button className="btn btn-primary"
                                            onClick={() => openEditDialog(league.id, league.naziv_lige, league.rang)}>
                                        Uredi</button>
                                    <button className="btn btn-danger" onClick={() => openDeleteDialog(league.id)}>
                                        Izbriši
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
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
    } else {
        return (
            <>
                <ModalLoader isActive={loaderActive} />
                <RetryError isActive={retryButtonDisplayed} retry={() => retryGettingLeagues()} />
                <h1 className="text-center pt-4 mb-5">Lige KSS-a</h1>
                <div className="container-fluid text-center align-content-center overflow-auto mb-5">
                    {leagues.map(league => {
                        return (
                            <h5><Link to={"leagues/" + league.id}>{league.naziv_lige}</Link></h5>
                        )
                    })}
                </div>
            </>
        )
    }
}
function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token
    }
}

export default connect(mapStateToProps)(League);
