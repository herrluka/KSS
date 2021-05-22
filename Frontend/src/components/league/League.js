import { useEffect, useState } from 'react';
import { getAllLeagues, createLeague, updateLeague, deleteLeague } from "./LeagueService";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import LeagueDialog from "./LeagueDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import LeaguesListForAdmin from "./LeaguesListForAdmin";
import LeaguesHeaderForAdmin from "./LeaguesHeaderForAdmin";
import LeaguesHeader from "./LeaguesHeader";
import LeaguesList from "./LeaguesList";
import {createSuccessAlert, createErrorAlert} from "../../alertHelper";


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

    function saveNewLeague(event) {
        event.preventDefault();
        setLoaderActive(true);
        createLeague(leagueInDialog, props.token).then(response => {
            setDialogShown(false);
            createSuccessAlert("Liga sačuvana");
            setLeagues([
                ...leagues,
                response.data.content.league
            ])
        }).catch(error => {
            createErrorAlert("Liga nije sačuvana");
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
            createSuccessAlert("Liga ažurirana");
            retryGettingLeagues();
        }).catch(error => {
            createErrorAlert("Liga nije ažurirana");
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function deleteExistingLeague(id) {
        setLoaderActive(true);
        deleteLeague(id, props.token).then(response => {
            createSuccessAlert("Liga obrisana");
            setDeleteDialogShown(false);
            retryGettingLeagues();
        }).catch(error => {
            createErrorAlert("Liga nije obrisana");
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
