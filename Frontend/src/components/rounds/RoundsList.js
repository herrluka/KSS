import {useHistory} from 'react-router-dom';

function RoundsList(props) {

    const history = useHistory();

    function routeToMatches(roundId) {
        history.push('/rounds/' + roundId + '/matches');
    }

    return (
        <div className="container text-center w-50 py-3">
            {props.rounds.map(round => {
                return (
                    <div key={round.id} className="my-4 border border-secondary text-center hoverable-round" onClick={() => routeToMatches(round.id)}>
                        <div>
                            <h4 className="my-2">{round.naziv}</h4>
                            <p>{(round.datum_od===null?'':round.datum_od) + ' - ' + (round.datum_do===null?'':round.datum_do)}</p>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}

export default RoundsList;