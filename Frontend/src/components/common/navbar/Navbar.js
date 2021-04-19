import React, {useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import NavbarAuth from "./NavbarAuth";
import {
    faBalanceScaleRight,
    faBasketballBall,
    faHome,
    faRunning,
    faUser,
    faUserFriends
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";
import roles from "../../../constants";

function Navbar(props) {

    const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);
    const history = useHistory();

    function logout() {
        props.setAuthData();
        localStorage.removeItem('Token');
        localStorage.removeItem('userName');
        history.push("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button"  data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"  aria-expanded="false"
                    aria-label="Toggle navigation" onClick={() => setNavbarCollapsed(!isNavbarCollapsed)}>
                <span className="navbar-toggler-icon" />
            </button>
            <div className={isNavbarCollapsed?"navbar-collapse":"collapse navbar-collapse"} id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faHome} />Početna</Link>
                    </li>
                    {props.isAdmin?
                        <li className="nav-item">
                            <Link to="/users" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faUser} />Korisnici</Link>
                        </li>:null
                    }
                    <li className="nav-item">
                        <Link to="/leagues" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faBasketballBall} />Lige</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/players" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faRunning} />Igrаči</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/clubs" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faUserFriends} />Klubovi</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/referees" className="nav-link"><FontAwesomeIcon className="h5 mr-2 mb-0" icon={faBalanceScaleRight} />Sudije</Link>
                    </li>
                </ul>
                <NavbarAuth handleLogout={() => logout()} userName={props.userName}/>
            </div>
        </nav>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        setAuthData: () => {dispatch({type: 'SET_AUTH_FIELDS', token: null, userName: null, role: null})}
    }
}

function mapStateToProps(state) {
    return {
        userName: state.userName,
        isAdmin: state.role === roles.ADMINISTRATOR
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);