function RoundDialog(props) {
    return (
        <>
            <div id="editRoundModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form id="new-player-form" onSubmit={event => props.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">{props.mode==='CREATE'?'Dodaj kolo':'Izmeni kolo'}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Ime</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.round.name}/>
                                </div>
                                <div className="form-group">
                                    <label>Datum početka</label>
                                    <input type="date" className="form-control" name="startDate"
                                           onChange={event => props.onInputChange(event)}
                                           value={props.round.startDate}/>
                                </div>
                                <div className="form-group">
                                    <label>Datum kraja</label>
                                    <input type="date" className="form-control" name="endDate"
                                           onChange={event => props.onInputChange(event)}
                                           value={props.round.endDate} />
                                </div>
                                <div className="form-group">
                                    <label>Eliminaciona faza</label>
                                    <input type="checkbox" className="d-block" style={{height: '30px', width: '30px'}} name="eliminatePhase"
                                           onChange={() => props.onCheckBoxChange()}
                                           checked={props.round.eliminatePhase} />
                                </div>
                                {props.mode==='EDIT'?<div className="form-group">
                                    <label>Liga</label>
                                    <select className="form-control" name="leagueId"
                                           onChange={event => props.onInputChange(event)} required
                                            value={props.round.leagueId} >
                                        {props.existingLeagues.map(league => {
                                            return <option key={league.id} value={league.id}>{league.naziv_lige}</option>
                                        })}
                                    </select>
                                </div>:null}
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

export default RoundDialog;