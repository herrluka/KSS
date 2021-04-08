function DeleteDialog(state) {
    return (
        <>
            <div id="deleteEmployeeModal" className={"centered w-25 fade show " + (state.isDialogShown?"d-block ":"d-none")}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h4 className="modal-title">Obrišite igrača</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => state.closeDialog()}>×
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Jeste li sigurni da želite da izbrišete igrača?</p>
                                <p className="text-warning"><small>Ova akcija je nepovratna.</small></p>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Odustani"
                                       onClick={() => state.closeDialog()}/>
                                <input type="button" className="btn btn-danger" value="Izbriši"
                                onClick={() => state.confirmDeletePlayer()}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {state.isDialogShown?<div className="modal-backdrop fade show"  style={{zIndex: 1040}} onClick={() => state.closeDialog()} />:null}
        </>
    )
}

export default DeleteDialog;