import {useState} from 'react';
import SearchWithButton from "../common/search/SearchWithButton";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import CreatePlayerDialog from "./CreatePlayerDialog";
import {getPlayersByName, insertNewPlayer} from "./PlayerService";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import {connect} from "react-redux";
import roles from "../../constants"
import PlayersList from "./PlayersList";
import PlayerHeaderAdmin from "./PlayerHeaderAdmin";
import PlayerHeader from "./PlayerHeader";

function Players(props) {

    const [searchText, setSearchText] = useState('');
    const [players, setPlayers] = useState([]);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [isContentLoaded, setContentLoaded] = useState(false);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
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
        insertNewPlayer({
            name: newPlayer.name,
            surname: newPlayer.surname,
            birth_date: newPlayer.birth_date,
            medical_examination: newPlayer.medical_examination!==''?newPlayer.medical_examination:null
        }, props.token).then(response => {
            setDialogShown(false);
            showSuccessAlert();
            setNewPlayer({
                ...newPlayer,
                name: "",
                surname: "",
                birth_date: "",
                medical_examination: ""
            });
            setPlayers([]);
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function fetchPlayers(_searchText) {
        setLoaderActive(true);
        setPlayers([]);
        setServerErrorOccurred(false);
        setSearchText(_searchText);
        getPlayersByName(_searchText).then(players => {
            setPlayers(players.data.content);
            setServerErrorOccurred(false);
            setContentLoaded(true);
        }).catch(error => {
            setServerErrorOccurred(true);
            setPlayers([]);
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    return (
        <>
            <ModalLoader isActive={isLoaderActive} />
            <RetryError isActive={serverErrorOccurred} retry={() => fetchPlayers(searchText)} />
            {props.isAdmin?
                <PlayerHeaderAdmin showInsertDialogEvent={() => setDialogShown(!isDialogShown)}/>
                :
                <PlayerHeader />}
            <SearchWithButton search={(_searchText) => fetchPlayers(_searchText)} searchPlaceholder={"Pretražite igrače po imenu"} />
            <PlayersList players={players} isAdmin={props.isAdmin} isContentLoaded={isContentLoaded}/>
            {props.isAdmin ?
                <>
                    <CreatePlayerDialog isDialogShown={isDialogShown} closeDialog={() => setDialogShown(!isDialogShown)}
                                        onInputChange={(event) => handleChange(event)}
                                        onValidateForm={(event) => saveNewPlayer(event)} player={newPlayer}/>
                    < SuccessAlert alertStyle = {successAlertStyle} alertText="Igrač je uspešno sačuvan"/>
                    <ErrorAlert alertStyle={errorAlertStyle} alertText="Igrač nije sačuvan" />
                </>:
                null
            }
        </>
    )
}
function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token
    }
}

export default connect(mapStateToProps)(Players);
