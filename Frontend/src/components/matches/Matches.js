import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import MatchesList from "./MatchesList";
import {getMatchesByRoundId} from './MatchService';
import MatchesHeader from "./MatchesHeader";


function Matches(props) {

    const [matches, setMatches] = useState([]);
    const [round, setRound] = useState({
        id: null,
        roundName: '',
        leagueName: ''
    });
    const params = useParams();

    function fetchData() {
        getMatchesByRoundId(params.id).then(response => {
            setMatches(response.data.content.utakmice);
            setRound({
                id: response.data.content.kolo.id,
                roundName: response.data.content.kolo.naziv_kola,
                leagueName: response.data.content.kolo.naziv_lige
            })
        })
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <MatchesHeader round={round} />
            <MatchesList matches={matches} />
        </>
    )
}

export default Matches;