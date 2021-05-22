import {getRoundsByLeagueId, createRound, updateRound, deleteRound} from "./RoundsService";
import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import {connect} from "react-redux";
import roles from "../../constants";
import RoundsList from "./RoundsList";
import RoundsListAdmin from "./RoundsListAdmin";
import RoundDialog from "./RoundDialog";
import {getAllLeagues} from "../league/LeagueService";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import {createErrorAlert, createSuccessAlert} from "../../alertHelper";


function LeagueRounds(props) {

    const params = useParams();
    const [rounds, setRounds] = useState([]);
    const [leagueInfo, setLeagueInfo] = useState({
        id: null,
        name: ''
    });
    const [standings, setStandings] = useState([]);
    const [availableLeagues, setAvailableLeagues] = useState([]);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
    const [isEditDialogShown, setEditDialogShown] = useState(false);
    const [editDialogMode, setEditDialogMode] = useState('CREATE');
    const [isLoaderShown, setLoaderShown] = useState(true);
    const roundInitialState = {
        id: 'null',
        name: '',
        startDate: '',
        endDate: '',
        eliminatePhase: false,
        leagueId: ''
    };
    const [roundInDialog, setRoundInDialog] = useState(roundInitialState);
    const [roundIdInDeleteDialog, setRoundIdInDeleteDialog] = useState(null);

    function fetchData() {
        getRoundsByLeagueId(params.id).then(response => {
            let sortBy = [{
                prop:'wins',
                direction: -1
            },{
                prop:'total_points',
                direction: -1
            }];
            setStandings(response.data.content.rang_lista.sort(function(a,b){
                let i = 0, result = 0;
                while(i < sortBy.length && result === 0) {
                    result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
                    i++;
                }
                return result;
            }));
            setRounds(response.data.content.kola);
            setLeagueInfo({
                id: response.data.content.liga.id,
                name: response.data.content.liga.naziv_lige,
            });
            setContentLoaded(true);
            setServerErrorOccurred(false);
            setLoaderShown(false);
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    function fetchLeagues() {
        getAllLeagues().then(response => {
            setAvailableLeagues(response.data.content);
            fetchData();
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    function handleRetry() {
        setServerErrorOccurred(false);
        setContentLoaded(false);
        if (availableLeagues.length === 0) {
            fetchLeagues();
        } else {
            fetchData();
        }
    }

    function handleCheckBoxChange() {
        setRoundInDialog({
            ...roundInDialog,
            eliminatePhase: !roundInDialog.eliminatePhase
        })
    }

    function handleChange(event) {
        setRoundInDialog({
            ...roundInDialog,
            [event.target.name]: event.target.value,
        })
    }

    function handleOpenCreateDialog() {
        setEditDialogMode('CREATE');
        setRoundInDialog(roundInitialState);
        setEditDialogShown(true);
    }

    function handleOpenEditDialog(_roundId, _roundName, _roundStartDate, _roundEndDate, _eliminatePhase, _leagueId) {
        setRoundInDialog({
            id: _roundId,
            name: _roundName,
            startDate: _roundStartDate,
            endDate: _roundEndDate,
            eliminatePhase: _eliminatePhase,
            leagueId: _leagueId,
        });
        setEditDialogMode('EDIT');
        setEditDialogShown(true);
    }

    function handleOpenDeleteDialog(roundId) {
        setDeleteDialogShown(true);
        setRoundIdInDeleteDialog(roundId);
    }

    function handleUpdateRound(event) {
        event.preventDefault();
        setLoaderShown(true);
        if (editDialogMode === 'EDIT'){
            updateRound(roundInDialog.id, {
                name: roundInDialog.name,
                date_from: roundInDialog.startDate=== ''? null : roundInDialog.startDate,
                date_to: roundInDialog.endDate=== '' ? null : roundInDialog.endDate,
                eliminate_phase: roundInDialog.eliminatePhase,
                league_id: roundInDialog.leagueId,
            }, props.token).then(response => {
                createSuccessAlert("Kolo ažurirano");
                setEditDialogShown(false);
                let newRoundsList;
                if (params.id !== roundInDialog.leagueId) {
                    newRoundsList = rounds.filter(round => {
                        if (round.id !== roundInDialog.id)
                            return round;
                    });
                } else {
                    newRoundsList = rounds.map(round => {
                    if (round.id === roundInDialog.id) {
                        return {
                            id : roundInDialog.id,
                            naziv : roundInDialog.name,
                            datum_od : roundInDialog.startDate,
                            datum_do : roundInDialog.endDate,
                            eliminaciona_faza : roundInDialog.eliminatePhase,
                            liga_id : roundInDialog.leagueId
                        }
                    } else {
                        return round;
                    }
                });
                }
                setRounds(newRoundsList);
                setLoaderShown(false);
            }).catch(error => {
                createErrorAlert("Kolo nije ažurirano");
                setLoaderShown(false);
            })
        } else if (editDialogMode === 'CREATE') {
            createRound({
                name: roundInDialog.name,
                date_from: roundInDialog.startDate === ''? null : roundInDialog.startDate,
                date_to: roundInDialog.endDate === '' ? null : roundInDialog.endDate,
                eliminate_phase: roundInDialog.eliminatePhase,
                league_id: params.id,
            }, props.token).then(response => {
                createSuccessAlert("Kolo je sačuvano");
                setEditDialogShown(false);
                setRounds([
                    ...rounds,
                    response.data.content.round
                ]);
                setLoaderShown(false);
            }).catch(error => {
                createErrorAlert("Kolo nije sačuvano");
                setLoaderShown(false);
            })
        }
    }

    function handleDeleteRound() {
        setLoaderShown(true);
        deleteRound(roundIdInDeleteDialog, props.token).then(response => {
            createSuccessAlert("Kolo je obrisano");
            setRounds(rounds.filter(round => round.id !== roundIdInDeleteDialog));
            setDeleteDialogShown(false);
            setLoaderShown(false);
        }).catch(error => {
            createErrorAlert("Kolo nije obrisano");
            setLoaderShown(false);
        })
    }

    useEffect(() => {
        fetchLeagues();
    }, []);

    if (serverErrorOccurred) {
        return <RetryError isActive={true} retry={() => handleRetry()}/>
    }

    if (!contentLoaded) {
        return <ModalLoader isActive={true} />
    }

    return(
        <div>
            <ModalLoader isActive={isLoaderShown} />
            <div className="text-center my-5">
                <h1>{leagueInfo.name}</h1>
            </div>
            {props.isAdmin?<div className="mr-5 m-5 text-center">
                <button className="btn btn-success" onClick={() => handleOpenCreateDialog()}>
                    <div className="d-flex">
                        <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj kolo
                    </div>
                </button>
            </div>:null}
            <div className="text-center d-flex align-content-center justify-content-center">
                <table className="table w-50">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">Klub</th>
                        <th scope="col">Pobede</th>
                        <th scope="col">Porazi</th>
                        <th scope="col">Broj poena</th>
                    </tr>
                    </thead>
                    <tbody>
                    {standings.map(club => {
                        return (
                            <tr key={club.club_name}>
                                <th scope="row">{club.club_name}</th>
                                <td>{club.wins}</td>
                                <td>{club.loses}</td>
                                <td>{club.total_points}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            {props.isAdmin?<RoundsListAdmin rounds={rounds}
                                            openEditDialog={(roundId, roundName, roundStartDate, roundEndDate, roundEliminatePhase, roundLeagueId) =>
                                                handleOpenEditDialog(roundId, roundName, roundStartDate, roundEndDate, roundEliminatePhase, roundLeagueId)}
                                                openDeleteDialog={(roundId) => handleOpenDeleteDialog(roundId)} />
            :<RoundsList rounds={rounds} />}
            {props.isAdmin?<RoundDialog round={roundInDialog} isDialogShown={isEditDialogShown}
                                        existingLeagues={availableLeagues}
                                        closeDialog={() => setEditDialogShown(!isEditDialogShown)}
                                        onInputChange={event => handleChange(event)}
                                        onValidateForm={event => handleUpdateRound(event)}
                                        onCheckBoxChange={() => handleCheckBoxChange()}
                                        mode={editDialogMode}/>
            :null}
            {props.isAdmin?<DeleteDialog
                whatToDelete="kolo"
                isDialogShown={isDeleteDialogShown}
                closeDialog={() => setDeleteDialogShown(!isDeleteDialogShown)}
                confirmDelete={() => handleDeleteRound()} />:null}
        </div>
    )

}

function mapStateToProps(state) {
    return {
        token: state.token,
        isAdmin: state.role === roles.ADMINISTRATOR
    }
}

export default connect(mapStateToProps)(LeagueRounds);