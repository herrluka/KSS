
function ClubDialog(props) {

    return (
        <>
            <div id="editClubModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form onSubmit={event => props.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">{props.mode==='CREATE'?'Napravite novi klub':'Izmenite klub'}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Naziv kluba</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={event => props.onInputChange(event)}
                                           value={props.club.name} />
                                </div>
                                <div className="form-group">
                                    <label>Godina osnivanja</label>
                                    <input type="number" className="form-control" name="foundationYear"
                                           onChange={event=> props.onInputChange(event)}
                                           value={props.club.foundationYear}/>
                                </div>
                                <div className="form-group">
                                    <label>Adresa</label>
                                    <input type="text" className="form-control" name="address"
                                           onChange={event=> props.onInputChange(event)}
                                           value={props.club.address}/>
                                </div>
                                <div className="form-group">
                                    <label>Telefon</label>
                                    <input type="text" className="form-control" name="phone"
                                           onChange={event=> props.onInputChange(event)}
                                           value={props.club.phone}/>
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

export default ClubDialog;