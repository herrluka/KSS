function SuccessAlert(props) {
    return (
        <div className="alert alert-success w-50 alert-bottom-right" style={props.alertStyle}>
            <strong>Uspešno!</strong> {props.alertText}
        </div>
    )
}

export default SuccessAlert