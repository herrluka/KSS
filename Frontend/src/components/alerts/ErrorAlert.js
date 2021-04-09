function ErrorAlert(state) {
    return (
        <div className="alert alert-danger w-50 alert-bottom-right" style={state.alertStyle}>
            <strong>Greška!</strong> {state.alertText}
        </div>
    )
}

export default ErrorAlert