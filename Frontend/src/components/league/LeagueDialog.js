function LeagueDialog(props) {

    function handleSubmit(event) {
        if (props.mode === 'CREATE') {
            props.onValidateCreateForm(event);
        } else {
            props.onValidateEditForm(event, props.league.id);
        }
    }
    return (
        <>
            <div id="addEmployeeModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form id="new-player-form" onSubmit={event => handleSubmit(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">{props.mode==="CREATE"?'Kreiraj novu ligu':'Izmeni ligu'}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Naziv</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={event => props.onInputChange(event)}
                                    value={props.league.name}/>
                                </div>
                                <div className="form-group">
                                    <label>Rang</label>
                                    <input type="number" className="form-control" name="rank" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.league.rank}/>
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

export default LeagueDialog;