function ErrorAlert(props) {
    return (
        <div className="alert alert-danger w-50 alert-bottom-right" style={props.alertStyle}>
            <strong>Greška!</strong> {props.alertText}
        </div>
    )
}

export default ErrorAlert