import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Auth from "./Auth";

function Navbar(props) {

    const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);
    const [isDropdownCollapsed, setDropdownCollapsed] = useState(false);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button"  data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"  aria-expanded="false"
                    aria-label="Toggle navigation" onClick={() => setNavbarCollapsed(!isNavbarCollapsed)}>
                <span className="navbar-toggler-icon" />
            </button>
            <div className={isNavbarCollapsed?"navbar-collapse":"collapse navbar-collapse"} id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Početna</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/users" className="nav-link">Korisnici</Link>
                    </li>
                    <li className="nav-link active dropdown" style={{cursor: 'pointer'}} onClick={() => setDropdownCollapsed(!isDropdownCollapsed)}>
                            Dropdown
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={isDropdownCollapsed?{display:"block"}:{display:"none"}}>
                            {/*<a className="dropdown-item" href="#">Action</a>*/}
                            {/*<a className="dropdown-item" href="#">Another action</a>*/}
                            {/*<div className="dropdown-divider" />*/}
                            {/*<a className="dropdown-item" href="#">Something else here</a>*/}
                        </div>
                    </li>
                    {/*<li className="nav-item">*/}
                    {/*    <a className="nav-link disabled" href="#">Disabled</a>*/}
                    {/*</li>*/}
                </ul>
                <Auth/>
            </div>
        </nav>
    )
}

export default Navbar;