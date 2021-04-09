function SuccessAlert(state) {
    return (
        <div className="alert alert-success w-50 alert-bottom-right" style={state.alertStyle}>
            <strong>Uspešno!</strong> {state.alertText}
        </div>
    )
}

export default SuccessAlert