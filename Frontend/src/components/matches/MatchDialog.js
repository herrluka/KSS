function MatchDialog(props) {

    return (
        <>
            <div id="matchModal" className={"match-modal-dialog centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog m-0">
                    <div className="modal-content">
                        <form id="new-match-form" onSubmit={event => props.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">{props.mode==='CREATE'?'Nova utakmica':'Izmena utakmice'}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Domaćin</label>
                                    <select className="form-control" name="homeTeam"
                                            onChange={event => props.handleHomeTeamChange(event)}
                                            value={props.match.homeTeam} disabled={!props.isAdmin}>
                                        <option key='' selected value={''}>{''}</option>
                                        {props.homeTeamChoices.map(club => {
                                            return <option key={club.id} value={club.id}>{club.naziv_kluba}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Gost</label>
                                    <select className="form-control" name="guestTeam"
                                            onChange={event => props.handleGuestTeamChange(event)}
                                            value={props.match.guestTeam} disabled={!props.isAdmin}>
                                        <option key='' selected value={''}>{''}</option>
                                        {props.guestTeamChoices.map(club => {
                                            return <option key={club.id} value={club.id}>{club.naziv_kluba}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Domaćin koševa</label>
                                    <input type="number" className="form-control" name="homeTeamPoints"
                                           onChange={event => props.onInputChange(event)}
                                           value={props.match.homeTeamPoints}/>
                                </div>
                                <div className="form-group">
                                    <label>Gost koševa</label>
                                    <input type="number" className="form-control" name="guestTeamPoints"
                                           onChange={event => props.onInputChange(event)}
                                           value={props.match.guestTeamPoints}/>
                                </div>
                                <div className="form-group">
                                    <label>Prvi sudija</label>
                                    <select className="form-control" name="firstRefereeId"
                                            onChange={event => props.handleFirstRefereeChange(event)}
                                            value={props.match.firstRefereeId} disabled={!props.isAdmin}>
                                        <option key='0' selected value={null}>{''}</option>
                                        {props.firstRefereeChoices.map(referee => {
                                            return <option key={referee.id} value={referee.id}>{referee.ime + ' ' + referee.prezime}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Drugi sudija</label>
                                    <select className="form-control" name="secondRefereeId"
                                            onChange={event => props.onInputChange(event)}
                                            value={props.match.secondRefereeId} disabled={!props.isAdmin}>
                                        <option key='' selected value={''}>{''}</option>
                                        {props.secondRefereeChoices.map(referee => {
                                            return <option key={referee.id} value={referee.id}>{referee.ime + ' ' + referee.prezime}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Datum održavanja</label>
                                    <input type="date" className="form-control" name="matchDate"
                                           onChange={event => props.onInputChange(event)}
                                           value={props.match.matchDate} disabled={!props.isAdmin} />
                                </div>
                                <div className="form-group">
                                    <label>Odloženo</label>
                                    <input type="checkbox" className="d-block" style={{height: '30px', width: '30px'}} name="postponed"
                                           onChange={() => props.onCheckBoxChange()}
                                           checked={props.match.postponed} disabled={!props.isAdmin} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Napusti"
                                       onClick={() => props.closeDialog()}/>
                                <input type="submit" className="btn btn-success" value="Potvrdi" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {props.isDialogShown?<div className="modal-backdrop fade show"  style={{zIndex: 1040}} onClick={() => props.closeDialog()} />:null}
        </>
    )
}

export default MatchDialog;