import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import MatchesList from "./MatchesList";
import {getMatchesByRoundId, insertMatch, updateMatch, deleteMatch} from './MatchService';
import MatchesHeader from "./MatchesHeader";
import {connect} from "react-redux";
import roles from "../../constants";
import RetryError from "../common/errors/RetryError";
import ModalLoader from "../common/loaders/ModalLoader";
import {getClubs} from "../clubs/ClubService";
import {getRefereesByRoundId} from "../referees/RefereeService";
import MatchDialog from "./MatchDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import DeleteDialog from "../common/dialogs/DeleteDialog";

let matchIdInDeleteDialog = null;
function Matches(props) {

    const [matches, setMatches] = useState([]);
    const [existingClubs, setExistingClubs] = useState([]);
    const [homeTeamChoices, setHomeTeamChoices] = useState([]);
    const [guestTeamChoices, setGuestTeamChoices] = useState([]);
    const [firstRefereeChoices, setFirstRefereeChoices] = useState([]);
    const [secondRefereeChoices, setSecondRefereeChoices] = useState([]);
    const [compatibleReferees, setCompatibleReferees] = useState([]);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isContentLoaded, setContentLoaded] = useState(false);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [dialogMode, setDialogMode] = useState(null);
    const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
    const matchInDialogInitialState = {
        id: null,
        homeTeam: '',
        guestTeam: '',
        homeTeamPoints: 0,
        guestTeamPoints: 0,
        firstRefereeId: '',
        secondRefereeId: '',
        matchDate: '',
        postponed: false,
    };
    const [matchInDialog, setMatchInDialog] = useState(matchInDialogInitialState);
    const [round, setRound] = useState({
        id: null,
        roundName: '',
        leagueName: ''
    });
    const params = useParams();
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

    function handleOpenDeleteDialog(matchId) {
        setDeleteDialogShown(true);
        matchIdInDeleteDialog = matchId;
    }

    function handleChange(event) {
        setMatchInDialog({
            ...matchInDialog,
            [event.target.name]: event.target.value
        })
    }

    function handleCheckboxChange() {
        setMatchInDialog({
            ...matchInDialog,
            postponed: !matchInDialog.postponed
        })
    }

    function handleHomeTeamChange(event) {
        setGuestTeamChoices(existingClubs.filter(club => club.id !== parseInt(event.target.value)));
        setMatchInDialog({
            ...matchInDialog,
            [event.target.name]: event.target.value
        })
    }

    function handleGuestTeamChange(event) {
        setHomeTeamChoices(existingClubs.filter(club => club.id !== parseInt(event.target.value)));
        setMatchInDialog({
            ...matchInDialog,
            [event.target.name]: event.target.value
        })
    }

    function handleFirstRefereeChange(event) {
        setSecondRefereeChoices(compatibleReferees.filter(referee => referee.id !== parseInt(event.target.value)));
        setMatchInDialog({
            ...matchInDialog,
            [event.target.name]: event.target.value
        })
    }

    function handleSecondRefereeChange(event) {
        setFirstRefereeChoices(compatibleReferees.filter(referee => referee.id !== parseInt(event.target.value)));
        setMatchInDialog({
            ...matchInDialog,
            [event.target.name]: event.target.value
        })
    }

    function fetchData() {
        getMatchesByRoundId(params.id).then(response => {
            setMatches(response.data.content.utakmice);
            setRound({
                id: response.data.content.kolo.id,
                roundName: response.data.content.kolo.naziv_kola,
                leagueName: response.data.content.kolo.naziv_lige
            });
            setContentLoaded(true);
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    function retryGettingData() {
        if (round.id === null) {
            fetchData();
        }

        if (props.isAdmin) {
            if (compatibleReferees.length === 0) {
                fetchReferees();
            }
            if (existingClubs.length === 0) {
                fetchClubs();
            }
        }
        setServerErrorOccurred(false);
    }

    function fetchClubs() {
        getClubs(params.id, props.token).then(response => {
            setExistingClubs(response.data.content);
            setHomeTeamChoices(response.data.content);
            setGuestTeamChoices(response.data.content);
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    function fetchReferees() {
        getRefereesByRoundId(params.id, props.token).then(response => {
            setCompatibleReferees(response.data.content);
            setFirstRefereeChoices(response.data.content);
            setSecondRefereeChoices(response.data.content);
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    function saveMatch(event) {
        event.preventDefault();
        setLoaderActive(true);
        if (dialogMode === 'CREATE') {
            insertMatch({
                team_A_id: matchInDialog.homeTeam===''?null:matchInDialog.homeTeam,
                team_B_id: matchInDialog.guestTeam===''?null:matchInDialog.guestTeam,
                team_A_points: matchInDialog.homeTeamPoints===''?0:matchInDialog.homeTeamPoints,
                team_B_points: matchInDialog.guestTeamPoints===''?0:matchInDialog.guestTeamPoints,
                date_played: matchInDialog.matchDate===''?null:matchInDialog.matchDate,
                round_id: params.id,
                user_updated_id: props.userId,
                isPostponed: matchInDialog.postponed,
                first_referee_id: matchInDialog.firstRefereeId===''?null:matchInDialog.firstRefereeId,
                second_referee_id: matchInDialog.secondRefereeId===''?null:matchInDialog.secondRefereeId,
            }, props.token).then(res => {
                showSuccessAlert();
                setDialogShown(false);
                fetchData();
            }).catch(error => {
                showErrorAlert();
            }).finally(() => {
                setLoaderActive(false);
            })
        } else {
            let requestBody;
            if (props.isDelegate) {
                requestBody = {
                    team_A_points: matchInDialog.homeTeamPoints===''?0:matchInDialog.homeTeamPoints,
                    team_B_points: matchInDialog.guestTeamPoints===''?0:matchInDialog.guestTeamPoints,
                    user_updated_id: props.userId,
                }
            } else {
                requestBody =  {
                    team_A_id: matchInDialog.homeTeam===undefined||matchInDialog.homeTeam===''?null:matchInDialog.homeTeam,
                    team_B_id: matchInDialog.guestTeam===undefined||matchInDialog.guestTeam===''?null:matchInDialog.guestTeam,
                    team_A_points: matchInDialog.homeTeamPoints===''?0:matchInDialog.homeTeamPoints,
                    team_B_points: matchInDialog.guestTeamPoints===''?0:matchInDialog.guestTeamPoints,
                    date_played: matchInDialog.matchDate,
                    round_id: params.id,
                    user_updated_id: props.userId,
                    isPostponed: matchInDialog.postponed,
                    first_referee_id: matchInDialog.firstRefereeId===undefined?null:matchInDialog.firstRefereeId,
                    second_referee_id: matchInDialog.secondRefereeId===undefined?null:matchInDialog.secondRefereeId,
                }
            }
            updateMatch(matchInDialog.id, requestBody, props.token).then(response => {
                showSuccessAlert();
                setDialogShown(false);
                fetchData();
            }).catch(error => {
                showErrorAlert();
            }).finally(() => {
                setLoaderActive(false);
            })
        }
    }

    function confirmDelete() {
        setLoaderActive(true);
        deleteMatch(matchIdInDeleteDialog, props.token).then(response => {
            showSuccessAlert();
            setMatches(matches.filter(match => match.id !== matchIdInDeleteDialog));
            setDeleteDialogShown(false);
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function handleOpenCreateDialog() {
        setMatchInDialog(matchInDialogInitialState);
        setDialogShown(true);
        setDialogMode('CREATE');
    }

    function handleOpenEditDialog(matchId, matchHomeTeam, matchGuestTeam, homeTeamPoints, guestTeamPoints, firstReferee, secondReferee, user, matchDate, postponed) {
        setFirstRefereeChoices(compatibleReferees.filter(referee => referee.id !== secondReferee?.id));
        setSecondRefereeChoices(compatibleReferees.filter(referee => referee.id !== firstReferee?.id));
        setHomeTeamChoices(existingClubs.filter(team => team.id !== matchGuestTeam?.id));
        setGuestTeamChoices(existingClubs.filter(team => team.id !== matchHomeTeam?.id));
        setMatchInDialog({
            id: matchId,
            homeTeam: matchHomeTeam?.id,
            guestTeam: matchGuestTeam?.id,
            homeTeamPoints: homeTeamPoints,
            guestTeamPoints: guestTeamPoints,
            firstRefereeId: firstReferee?.id,
            secondRefereeId: secondReferee?.id,
            postponed: postponed,
            matchDate: matchDate,
        });
        setDialogShown(true);
        setDialogMode('EDIT');
    }

    useEffect(() => {
        fetchData();
        if (props.isAdmin) {
            fetchClubs();
            fetchReferees();
        }
    }, []);

    if (serverErrorOccurred) {
        return <RetryError isActive={true} retry={() => retryGettingData()} />
    }

    if (!isContentLoaded) {
        return <ModalLoader isActive={true} />
    }

    return (
        <>
            <ModalLoader isActive={isLoaderActive} />
            <MatchesHeader isAdmin={props.isAdmin} round={round} setDialogShownEvent={() => handleOpenCreateDialog()}/>
            <MatchesList matches={matches} isAdmin={props.isAdmin} isDelegate={props.isDelegate}
                         handleOpenDeleteDialog={(matchId) => handleOpenDeleteDialog(matchId) }
                         handleOpenEditDialog={(matchId, matchHomeTeam, matchGuestTeam, homeTeamPoints,
                                                guestTeamPoints, firstReferee, secondReferee, user, matchDate, postponed) =>
                             handleOpenEditDialog(matchId, matchHomeTeam, matchGuestTeam, homeTeamPoints,
                                 guestTeamPoints, firstReferee, secondReferee, user, matchDate, postponed)}/>
            <DeleteDialog isDialogShown={isDeleteDialogShown} whatToDelete={'utakmicu'}
                          closeDialog={() => setDeleteDialogShown(!isDeleteDialogShown)}
                          confirmDelete={() => confirmDelete()}/>
            <MatchDialog referees={compatibleReferees} mode={dialogMode} isAdmin={props.isAdmin}
                         homeTeamChoices={homeTeamChoices} guestTeamChoices={guestTeamChoices}
                         firstRefereeChoices={firstRefereeChoices} secondRefereeChoices={secondRefereeChoices}
                         isDialogShown={isDialogShown}
                         match={matchInDialog} onCheckBoxChange={() => handleCheckboxChange()}
                         onInputChange={event => handleChange(event)}
                         handleHomeTeamChange={event => handleHomeTeamChange(event)}
                         handleGuestTeamChange={event => handleGuestTeamChange(event)}
                         handleFirstRefereeChange={event => handleFirstRefereeChange(event)}
                         handleSecondRefereeChange={event => handleSecondRefereeChange(event)}
                         onValidateForm = {event => saveMatch(event)} closeDialog={() => setDialogShown(!isDialogShown)}/>
            <SuccessAlert alertStyle={successAlertStyle} alertText="Utakmica je uspešno sačuvana"/>
            <ErrorAlert alertStyle={errorAlertStyle} alertText="Utakmica nije sačuvana" />
        </>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token,
        isAdmin: state.role === roles.ADMINISTRATOR,
        isDelegate: state.role === roles.DELEGATE,
        userId: state.userId
    }
}

export default connect(mapStateToProps)(Matches);