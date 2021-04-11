function CreateRefereeDialog(props) {
    return (
        <>
            <div id="addRefereeModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form id="new-referee-form" onSubmit={event => props.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">Novi sudija</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Ime</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.referee.name}/>
                                </div>
                                <div className="form-group">
                                    <label>Prezime</label>
                                    <input type="text" className="form-control" name="surname" required
                                           onChange={event=> props.onInputChange(event)}
                                           value={props.referee.surname}/>
                                </div>
                                <div className="form-group">
                                    <label>Adresa</label>
                                    <input type="text" className="form-control" name="address" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.referee.address}/>
                                </div>
                                <div className="form-group">
                                    <label>Broj telefona</label>
                                    <input type="text" className="form-control" name="phone_number"
                                           onChange={event => props.onInputChange(event)} required
                                           value={props.referee.phone_number}/>
                                </div>
                                <div className="form-group">
                                    <label>Najviša liga</label>
                                    <select className="form-control" name="league"
                                           onChange={event => props.onInputChange(event)} required
                                            value={props.referee.league}>
                                        <option key='0' selected value={null}>{''}</option>
                                        {props.availableLeagues.map(league => {
                                            return <option key={league.id} value={league.id}>{league.naziv_lige}</option>
                                        })}
                                    </select>
                                    {props.selectionError?<label className="text-danger">Morate da izaberete najvišu ligu</label>:null}
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

export default CreateRefereeDialog;