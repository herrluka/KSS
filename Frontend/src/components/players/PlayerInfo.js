import { useEffect, useState} from 'react';
import { useParams, useHistory, Redirect} from 'react-router-dom';
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import {deletePlayer, getPlayerById, updatePlayer} from "./PlayerService";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import {connect} from "react-redux";
import roles from "../../constants";
import {createErrorAlert, createSuccessAlert} from "../../alertHelper";


function PlayerInfo(props) {

    const history = useHistory();
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [retryButtonDisplayed, setRetryButtonDisplayed] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [isContentAvailable, setContentAvailable] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const params = useParams();

    const [player, setPlayer] = useState({
        id: null,
        name: '',
        surname: '',
        birth_date: '',
        medical_examination: '',
        klubovi: []
    });

    function handleChange(event) {
        setPlayer({
            ...player,
            [event.target.name]: event.target.value
        })
    }

    function confirmPlayerUpdate(event) {
        event.preventDefault();
        setButtonsDisabled(true);
        setLoaderActive(true);
        updatePlayer(params.id, player, props.token).then(res => {
            setValidationError(null);
            createSuccessAlert("Igrač ažuriran");
        }).catch(error => {
            if (error.response.status === 400) {
                if (error.response.data.content.code === 1) {
                    setValidationError("Igrač registrovan za 2 kluba ne može da bude mlađi od 18 godina");
                }
            }
            createErrorAlert("Igrač nije ažuriran");
        }).finally(() => {
            setLoaderActive(false);
            setButtonsDisabled(false);
        });
    }

    function handleDeletePlayer() {
        setLoaderActive(true);
        return deletePlayer(params.id, props.token).then(response => {
            history.push("/players");
        }).catch(() => {
            createErrorAlert("Igrač nije ažuriran");
            setLoaderActive(false);
        })
    }

    function fetchPlayer() {
        setLoaderActive(true);
        setRetryButtonDisplayed(false);
        getPlayerById(params.id, props.token).then(response => {
            setContentAvailable(true);
            const _player = response.data.content.igrac;
            setPlayer({
                id: _player.id,
                name: _player.ime,
                surname: _player.prezime,
                birth_date: _player.datum_rodjenja,
                medical_examination: _player.lekarski_pregled_datum
            });
            setLoaderActive(false);
        }).catch(error => {
            if (error.response?.status === 404) {
                history.push("/error");
            }
            setRetryButtonDisplayed(true);
            setLoaderActive(false);
        })
    }

    useEffect(() => {
        fetchPlayer(props.token);
    }, []);

    if (props.isAdmin) {
        if (isContentAvailable) {
            return (
                <>
                    <DeleteDialog
                        whatToDelete="igrača"
                        isDialogShown={isDialogShown}
                        closeDialog={() => setDialogShown(!isDialogShown)}
                        confirmDelete={() => handleDeletePlayer()} />
                    <ModalLoader isActive={isLoaderActive} />
                    <div className="container-fluid pt-5">
                        <RetryError isActive={retryButtonDisplayed} retry={() => fetchPlayer()} />
                        <form onSubmit={event => confirmPlayerUpdate(event)}>
                            <div className="form-group w-50">
                                <label htmlFor="nameInput">Ime</label>
                                <input type="text" className="form-control" id="nameInput" aria-describedby="emailHelp"
                                       placeholder="Ime" name="name" value={player.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-50">
                                <label htmlFor="surnameInput">Prezime</label>
                                <input type="text" className="form-control" id="surnameInput" placeholder="Prezime"
                                       name="surname" value={player.surname} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-25">
                                <label htmlFor="birthDate">Datum rodjenja</label>
                                <input type="date" className="form-control" id="birthDate"
                                       name="birth_date" value={player.birth_date} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-25">
                                <label htmlFor="medicalExaminationDate">Datum lekarskog pregleda</label>
                                <input type="date" className="form-control" id="medicalExaminationDate"
                                       name="medical_examination" value={player.medical_examination} onChange={handleChange} required />
                            </div>
                            {validationError ? <div className="form-group w-25">
                                <label className="text-danger">{validationError}</label>
                            </div> : null
                            }
                            <button type="submit" className="btn btn-primary" disabled={buttonsDisabled}>Sačuvaj</button>
                            <button type="button" className="btn btn-danger ml-2" disabled={buttonsDisabled} onClick={() => setDialogShown(!isDialogShown)}>Obriši</button>
                        </form>
                    </div>
                </>
        )} else {
            return (
                <>
                    <ModalLoader isActive={isLoaderActive} />
                    <RetryError isActive={retryButtonDisplayed} retry={() => fetchPlayer()} />
                </>
            )
        }
        } else {
            return (
                <Redirect push to="/error" />
            )
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        isAdmin: state.role === roles.ADMINISTRATOR
    }
}

export default connect(mapStateToProps)(PlayerInfo);
