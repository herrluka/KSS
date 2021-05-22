import {useState} from 'react';
import SearchWithButton from "../common/search/SearchWithButton";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import CreatePlayerDialog from "./CreatePlayerDialog";
import {getPlayersByName, insertNewPlayer} from "./PlayerService";
import {connect} from "react-redux";
import roles from "../../constants"
import PlayersList from "./PlayersList";
import PlayerHeaderAdmin from "./PlayerHeaderAdmin";
import PlayerHeader from "./PlayerHeader";
import {createSuccessAlert, createErrorAlert} from "../../alertHelper";

function Players(props) {

    const [searchText, setSearchText] = useState('');
    const [players, setPlayers] = useState([]);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [isContentLoaded, setContentLoaded] = useState(false);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        surname: "",
        birth_date: "",
        medical_examination: ""
    });

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
            createSuccessAlert("Igrač sačuvan");
            setNewPlayer({
                ...newPlayer,
                name: "",
                surname: "",
                birth_date: "",
                medical_examination: ""
            });
            setPlayers([]);
        }).catch(error => {
            createErrorAlert("Igrač nije sačuvan");
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
