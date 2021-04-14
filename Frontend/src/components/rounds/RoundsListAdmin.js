function RoundsListAdmin(props) {
    return (
        <div className="container text-center w-50 py-3">
            {props.rounds.map(round => {
                return (
                    <div key={round.id} className="my-4 border border-secondary text-center hoverable-round-admin">
                        <div>
                            <h4 className="my-2">{round.naziv}</h4>
                            <p>{(round.datum_od===null?'':round.datum_od) + ' - ' + (round.datum_do===null?'':round.datum_do)}</p>
                        </div>
                        <div className="d-flex justify-content-center align-content-center">
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