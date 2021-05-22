import { useEffect, useState} from 'react';
import { useParams, useHistory, Redirect} from 'react-router-dom';
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import {getRefereeById, updateReferee, deleteReferee} from "./RefereeService";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import {connect} from "react-redux";
import roles from "../../constants";
import {getAllLeagues} from "../league/LeagueService";
import {createErrorAlert, createSuccessAlert} from "../../alertHelper";


function RefereeInfo(props) {

    const history = useHistory();
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [existingLeagues, setExistingLeagues] = useState([]);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [isContentAvailable, setContentAvailable] = useState(false);
    const params = useParams();
    const [referee, setReferee] = useState({
        name: '',
        surname: '',
        address: '',
        phone_number: '',
        league_id: null,
    });

    function handleChange(event) {
        setReferee({
            ...referee,
            [event.target.name]: event.target.value
        })
    }

    function handleChangeLeague(event) {
        setReferee({
            ...referee,
            league_id: event.target.value,
        })
    }

    function confirmRefereeUpdate(event) {
        event.preventDefault();
        setButtonsDisabled(true);
        setLoaderActive(true);
        updateReferee(params.id, referee, props.token).then(response => {
            createSuccessAlert("Sudija ažuriran");
        }).catch(error => {
            createErrorAlert("Sudija nije ažuriran");
        }).finally(() => {
            setLoaderActive(false);
            setButtonsDisabled(false);
        });
    }

    function handleDeleteReferee() {
        setLoaderActive(true);
        return deleteReferee(params.id, props.token).then(response => {
            history.push("/referees");
        }).catch(() => {
            setLoaderActive(false);
            createErrorAlert("Sudija nije ažuriran");
        })
    }

    function fetchLeagues() {
        getAllLeagues().then(response => {
            setExistingLeagues(response.data.content);
            fetchReferee();
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    function fetchReferee() {
        getRefereeById(params.id, props.token).then(response => {
            setContentAvailable(true);
            const _referee = response.data.content;
            setReferee({
                name: _referee.ime,
                surname: _referee.prezime,
                address: _referee.adresa,
                phone_number: _referee.broj_telefona,
                league_id:  _referee.liga.id,
            });
            setLoaderActive(false);
        }).catch(error => {
            if (error.response?.status === 404) {
                history.push("/error");
            }
            setServerErrorOccurred(true);
            setLoaderActive(false);
        })
    }

    function retryFetchingReferee() {
        setLoaderActive(true);
        setContentAvailable(false);
        setServerErrorOccurred(false);
        if (existingLeagues.length === 0) {
            fetchLeagues();
        } else {
            fetchReferee();
        }
    }

    useEffect(() => {
        setLoaderActive(true);
        fetchLeagues();
    }, []);

    if (props.isAdmin) {

        if (serverErrorOccurred) {
            return <RetryError isActive={true} retry={() => retryFetchingReferee()} />
        }
        if (isContentAvailable) {
            return (
                <>
                    <DeleteDialog
                        whatToDelete="sudiju"
                        isDialogShown={isDialogShown}
                        closeDialog={() => setDialogShown(!isDialogShown)}
                        confirmDelete={() => handleDeleteReferee()} />
                    <ModalLoader isActive={isLoaderActive} />
                    <div className="container-fluid pt-5">
                        <form onSubmit={event => confirmRefereeUpdate(event)}>
                            <div className="form-group w-50">
                                <label htmlFor="nameInput">Ime</label>
                                <input type="text" className="form-control" id="nameInput" aria-describedby="emailHelp"
                                       placeholder="Ime" name="name" value={referee.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-50">
                                <label htmlFor="surnameInput">Prezime</label>
                                <input type="text" className="form-control" id="surnameInput" placeholder="Prezime"
                                       name="surname" value={referee.surname} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-25">
                                <label htmlFor="address">Adresa</label>
                                <input type="text" className="form-control" id="address"
                                       name="address" value={referee.address} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-25">
                                <label htmlFor="phoneNumber">Broj telefona</label>
                                <input type="text" className="form-control" id="phoneNumber"
                                       name="phone_number" value={referee.phone_number} onChange={handleChange} required />
                            </div>
                            <div className="form-group w-25">
                                <label htmlFor="league_id">Najviša liga</label>
                                <select className="form-control" name="league_id" value={referee.league_id}
                                        onChange={event => handleChangeLeague(event)}>
                                    {existingLeagues.map(_league => {
                                        return <option selected={_league.id===referee.league_id} key={_league.id} value={_league.id}>{_league.naziv_lige}</option>
                                    })}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={buttonsDisabled}>Sačuvaj</button>
                            <button type="button" className="btn btn-danger ml-2" disabled={buttonsDisabled} onClick={() => setDialogShown(!isDialogShown)}>Obriši</button>
                        </form>
                    </div>
                </>
            )} else {
                return <ModalLoader isActive={isLoaderActive} />
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

export default connect(mapStateToProps)(RefereeInfo);
