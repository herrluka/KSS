import {useHistory} from "react-router-dom";

function RoundsListAdmin(props) {
    const history = useHistory();

    function routeToMatches(roundId) {
        history.push('/rounds/' + roundId + '/matches');
    }

    return (
        <div className="container">
            {props.rounds.map(round => {
                return (
                    <div className="d-flex justify-content-center align-content-center">
                        <div key={round.id} className="my-4 border border-secondary text-center hoverable-round-admin w-50" onClick={() => routeToMatches(round.id)}>
                            <div>
                                <h4 className="my-2">{round.naziv}</h4>
                                <p>{(round.datum_od===null?'':round.datum_od) + ' - ' + (round.datum_do===null?'':round.datum_do)}</p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center align-content-center flex-column ml-2">
                            <button className="btn btn-success" onClick={() => props.openEditDialog(round.id, round.naziv, round.datum_od, round.datum_do, round.eliminaciona_faza, round.liga_id)}>Izmeni</button>
                            <button className="btn btn-danger" onClick={() => props.openDeleteDialog(round.id)}>Obriši</button>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}

export default RoundsListAdmin;