import { useState, useCallback } from 'react';
import axios from "../../api/axios";
import Search from "../common/search/Search";
import PlayerRow from "./PlayerRow";
import ModalLoader from "../common/ModalLoader";
import RetryError from "../common/errors/RetryError";

function Players() {

    const [searchText, setSearchText] = useState('');
    const [players, setPlayers] = useState([]);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [retryButtonDisplayed, setRetryButtonDisplayed] = useState(false);

    const fetchPlayers = useCallback((_searchText) => {
        setLoaderActive(true);
        setPlayers([]);
        setRetryButtonDisplayed(false);
        setSearchText(_searchText);
        axios.get('/players?playerName=' + _searchText).then(players => {
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
            <ModalLoader isActive={isLoaderActive} />
            <RetryError isActive={retryButtonDisplayed} retry={() => fetchPlayers(searchText)} />
            <Search searchPlayers={(_searchText) => fetchPlayers(_searchText)} />
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
                            return <PlayerRow key={player.playerId} playerId={player.id} playerName={player.ime} playerSurname={player.prezime} playerDateOfBirth={player.datum_rodjenja} />
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Players;
