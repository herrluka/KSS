import {Link} from "react-router-dom";
import React from "react";
import {faSignInAlt, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function NavbarAuth(props) {

    if (props.userName) {
        return (
            <ul className="navbar-nav">
                <li className="nav-link text-light">
                    Korisnik: {props.userName}
                </li>
                <li className="nav-link active" style={{cursor: 'pointer'}} onClick={() => props.handleLogout()}>
                    <FontAwesomeIcon className="h5 mr-2 mb-0" icon={faSignOutAlt} />Izlogujte se
                </li>
            </ul>
        )
    } else {
        return (
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link to="/login" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faSignInAlt} />Prijavite se</Link>
                </li>
            </ul>
        )
    }
}

export default NavbarAuth;