import { Link } from "react-router-dom";
import React from "react";

function Auth(state) {
    return (
        <ul className="navbar-nav">
            <li className="nav-item active">
                <Link to="/login" className="nav-link">Log in</Link>
            </li>
            <li className="nav-item active">
                <Link to="/register" className="nav-link">Create account</Link>
            </li>
        </ul>
    )
}

export default Auth;