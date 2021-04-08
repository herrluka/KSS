function SuccessAlert(state) {
    return (
        <div className="alert alert-success w-50 alert-bottom-right" style={state.alertStyle}>
            <strong>Uspešno!</strong> Igrač je ažuriran
        </div>
    )
}

export default SuccessAlert