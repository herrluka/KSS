import { useState, useCallback } from 'react';
import SearchWithButton from "../common/search/SearchWithButton";
import PlayerRow from "./PlayerRow";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import CreatePlayerDialog from "./CreatePlayerDialog";
import {getPlayersByName, insertNewPlayer} from "./PlayerService";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import {connect} from "react-redux";
import roles from "../../constants"

function Players(props) {

    const [searchText, setSearchText] = useState('');
    const [players, setPlayers] = useState([]);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [retryButtonDisplayed, setRetryButtonDisplayed] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        surname: "",
        birth_date: "",
        medical_examination: ""
    });

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

    function handleChange(event) {
        setNewPlayer({
            ...newPlayer,
            [event.target.name]: event.target.value
        })
    }

    function saveNewPlayer(event) {
        event.preventDefault();
        setLoaderActive(true);
        insertNewPlayer(newPlayer).then(response => {
            setDialogShown(false);
            showSuccessAlert();
            setNewPlayer({
                ...newPlayer,
                name: "",
                surname: "",
                birth_date: "",
                medical_examination: ""
            });
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    const fetchPlayers = useCallback((_searchText) => {
        setLoaderActive(true);
        setPlayers([]);
        setRetryButtonDisplayed(false);
        setSearchText(_searchText);
        getPlayersByName(_searchText).then(players => {
            setPlayers(players.data.content);
            setRetryButtonDisplayed(false);
        }).catch(error => {
            setRetryButtonDisplayed(true);
            setPlayers([]);
        }).finally(() => {
            setLoaderActive(false);
        })
    }, []);


    return (
        <>
            <CreatePlayerDialog isDialogShown={isDialogShown} closeDialog={() => setDialogShown(!isDialogShown)} onInputChange={(event) => handleChange(event)}
                                onValidateForm={(event) => saveNewPlayer(event)} player={newPlayer}/>
            <ModalLoader isActive={isLoaderActive} />
            <RetryError isActive={retryButtonDisplayed} retry={() => fetchPlayers(searchText)} />
            <SearchWithButton search={(_searchText) => fetchPlayers(_searchText)} searchPlaceholder={"Pretražite igrače po imenu"} />
            {props.isAdmin?<div className="mr-5 m-5 text-center">
                <button className="btn btn-success" onClick={() => setDialogShown(!isDialogShown)}>
                <div className="d-flex">
                    <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj igrača
                </div>
                    </button>
            </div>:null}
            <div className="container-fluid justify-content-center mt-5 text-center w-75">
                <table className="table">
                    <thead className="bg-primary">
                    <tr>
                        <th className="text-light" scope="col">Ime</th>
                        <th className="text-light" scope="col">Prezime</th>
                        <th className="text-light" scope="col">Datum rodjenja</th>
                    </tr>
                    </thead>
                    <tbody>
                        {players.map(player => {
                            return <PlayerRow playerId={player.id} playerName={player.ime}
                                              playerSurname={player.prezime} playerDateOfBirth={player.datum_rodjenja} isAdmin={props.isAdmin} />
                        })}
                    </tbody>
                </table>
            </div>
            <SuccessAlert alertStyle={successAlertStyle} alertText="Igrač je uspešno sačuvan"/>
            <ErrorAlert alertStyle={errorAlertStyle} alertText="Igrač nije sačuvan" />
        </>
    )
}
function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR
    }
}

export default connect(mapStateToProps)(Players);
