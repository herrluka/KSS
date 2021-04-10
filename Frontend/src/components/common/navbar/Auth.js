import {Link, useHistory} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";

function Auth(props) {

    const history = useHistory();

    function handleLogOut() {
        props.setAuthData();
        history.push("/");
    }

    if (props.userName) {
        return (
            <ul className="navbar-nav">
                <li className="nav-link text-light">
                    Korisnik: {props.userName}
                </li>
                <li className="nav-link active" style={{cursor: 'pointer'}} onClick={() => handleLogOut()}>
                    Izlogujte se
                </li>
            </ul>
        )
    } else {
        return (
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link to="/login" className="nav-link">Prijavite se</Link>
                </li>
            </ul>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setAuthData: () => {dispatch({type: 'SET_AUTH_FIELDS', token: null, userName: null, role: null})}
    }
}

function mapStateToProps(state) {
    return {
        userName: state.userName,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);