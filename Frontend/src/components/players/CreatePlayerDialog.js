function CreatePlayerDialog(state) {
    return (
        <>
            <div id="addEmployeeModal" className={"centered w-25 fade show " + (state.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form id="new-player-form" onSubmit={(event) => state.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">Novi igrač</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                onClick={() => state.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Ime</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={(event) => state.onInputChange(event)}
                                    value={state.player.name}/>
                                </div>
                                <div className="form-group">
                                    <label>Prezime</label>
                                    <input type="text" className="form-control" name="surname" required
                                           onChange={(event) => state.onInputChange(event)}
                                           value={state.player.surname}/>
                                </div>
                                <div className="form-group">
                                    <label>Datum rodjenja</label>
                                    <input type="date" className="form-control" name="birth_date" required
                                           onChange={(event) => state.onInputChange(event)}
                                           value={state.player.birth_date}/>
                                </div>
                                <div className="form-group">
                                    <label>Lekarski pregled</label>
                                    <input type="date" className="form-control" name="medical_examination"
                                           onChange={(event) => state.onInputChange(event)} required
                                           value={state.player.medical_examination}/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Napusti"
                                onClick={() => state.closeDialog()}/>
                                <input type="submit" className="btn btn-success" value="Potvrdi" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {state.isDialogShown?<div className="modal-backdrop fade show"  style={{zIndex: 1040}} onClick={() => state.closeDialog()} />:null}
        </>
    )
}

export default CreatePlayerDialog;