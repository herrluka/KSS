function DeleteDialog(props) {
    return (
        <>
            <div id="deleteModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h4 className="modal-title">Obrišite {props.whatToDelete}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => props.closeDialog()}>×
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Jeste li sigurni da želite da izbrišete {props.whatToDelete}?</p>
                                <p className="text-warning"><small>Ova akcija je nepovratna.</small></p>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Odustani"
                                       onClick={() => props.closeDialog()}/>
                                <input type="button" className="btn btn-danger" value="Izbriši"
                                onClick={() => props.confirmDelete(props.id)}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {props.isDialogShown?<div className="modal-backdrop fade show"  style={{zIndex: 1040}} onClick={() => props.closeDialog()} />:null}
        </>
    )
}

export default DeleteDialog;