function ErrorAlert(state) {
    return (
        <div className="alert alert-danger w-50 alert-bottom-right" style={state.alertStyle}>
            <strong>Greška!</strong> Greška se dogodila, neuspešno ažuriranje
        </div>
    )
}

export default ErrorAlert