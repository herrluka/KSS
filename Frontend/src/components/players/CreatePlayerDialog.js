function CreatePlayerDialog(props) {
    return (
        <>
            <div id="addPlayerModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form id="new-player-form" onSubmit={event => props.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">Novi igrač</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Ime</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={event => props.onInputChange(event)}
                                    value={props.player.name}/>
                                </div>
                                <div className="form-group">
                                    <label>Prezime</label>
                                    <input type="text" className="form-control" name="surname" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.player.surname}/>
                                </div>
                                <div className="form-group">
                                    <label>Datum rodjenja</label>
                                    <input type="date" className="form-control" name="birth_date" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.player.birth_date}/>
                                </div>
                                <div className="form-group">
                                    <label>Lekarski pregled</label>
                                    <input type="date" className="form-control" name="medical_examination"
                                           onChange={event => props.onInputChange(event)}
                                           value={props.player.medical_examination} />
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

export default CreatePlayerDialog;