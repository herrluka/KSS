import roles from "../../constants";
import {useEffect, useState} from "react";
import {saveUser} from "../users/UserService";
import ModalLoader from "../common/loaders/ModalLoader";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

function Register(props) {
    const newUserInitialState = {
        name: '',
        surname: '',
        userName: '',
        password: '',
        repeatedPassword: '',
        role: ''
    };
    const [availableRoles, setAvailableRoles] = useState([]);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [newUser, setNewUser] = useState(newUserInitialState);
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});
    const [formError, setFormError] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    function showSuccessAlert() {
        setSuccessAlertStyle({display: "block", animation: "slideToLeft 2s", zIndex: "1300"});
        setTimeout(() => {
            setSuccessAlertStyle({display: "block", animation: "slideToRight 2s", zIndex: "1300"});
            setTimeout(() => {
                setSuccessAlertStyle({display: "none"});
            }, 500);
        }, 3000);
    }

    function showErrorAlert() {
        setErrorAlertStyle({display: "block", animation: "slideToLeft 0.5s", zIndex: "1300"});
        setTimeout(() => {
            setErrorAlertStyle({display: "block", animation: "slideToRight 0.5s", zIndex: "1300"});
            setTimeout(() => {
                setErrorAlertStyle({display: "none"});
            }, 500);
        }, 3000);
    }

    function handleChange(event) {
        setNewUser({
           ...newUser,
            [event.target.name]: event.target.value
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        if (newUser.password !== newUser.repeatedPassword) {
            setFormError("Unete lozinke nisu iste");
            return;
        }
        setLoaderActive(true);
        setButtonDisabled(true);
        setFormError(null);
        saveUser({
            first_name: newUser.name,
            last_name: newUser.surname,
            username: newUser.userName,
            password: newUser.password,
            role: newUser.role
        }, props.token).then(response => {
            showSuccessAlert();
            setNewUser(newUserInitialState);
        }).catch(error => {
            if (error.response?.status === 400) {
                setFormError("Korisničko ime već postoji");
                return;
            }
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
            setButtonDisabled(false);
        });
    }

    useEffect(() => {
        let rolesArray = [];
        Object.keys(roles).forEach((roleKey) => {
            rolesArray.push({
                key: roleKey,
                value: roles[roleKey]
            })
        });
        setAvailableRoles(rolesArray);
    }, []);

    if (props.isAdmin) {
        return (
            <div className="form-signin-container text-center h-75">
                <ModalLoader isActive={isLoaderActive} />
                <form className="form-signin" onSubmit={event => handleFormSubmit(event)}>
                    <img className="mb-4" src={require("../../assets/kss-logo.jpg").default} alt=""
                         width="100" height="100" />
                    <h1 className="h3 mb-3 font-weight-normal">Registrujte korisnika</h1>
                    <label htmlFor="text" className="sr-only">Ime</label>
                    <input type="text" id="inputName" className="form-control" placeholder="Ime" required
                           autoFocus name="name" value={newUser.name} onChange={event => handleChange(event)}/>
                    <label htmlFor="text" className="sr-only">Prezime</label>
                    <input type="text" id="inputSurname" className="form-control" placeholder="Prezime" required
                           name="surname" value={newUser.surname} onChange={event => handleChange(event)} />
                    <label htmlFor="text" className="sr-only">Korisničko ime</label>
                    <input type="text" id="inputUsername" className="form-control" placeholder="Korisničko ime" required
                           name="userName" value={newUser.userName} onChange={event => handleChange(event)} />
                    <label htmlFor="inputPassword" className="sr-only">Lozinka</label>
                    <input type="password" id="inputPassword" className="form-control m-0" placeholder="Lozinka"
                           required value={newUser.password} name="password" onChange={event => handleChange(event)} />
                    <label htmlFor="inputPassword" className="sr-only">Ponovite lozinku</label>
                    <input type="password" id="inputRepeatPassword" className="form-control m-0" placeholder="Ponovite lozinku"
                           required name="repeatedPassword" value={newUser.repeatedPassword} onChange={event => handleChange(event)} />
                    <select id="selectRole" className="form-control mb-2" value={newUser.role} name="role" onChange={event => handleChange(event)}>
                        {availableRoles.map(role => {
                            return (
                                <option key={role.key} value={role.value}>{role.value}</option>
                            )
                        })
                        }
                    </select>
                    {formError?<label className="text-danger">{formError}</label>:null}
                    <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={buttonDisabled}>Registruj</button>
                </form>
                <SuccessAlert alertStyle={successAlertStyle} alertText="Korisnik je kreiran" />
                <ErrorAlert alertStyle={errorAlertStyle} alertText="Korisnik nije kreiran" />
            </div>
        )
    } else {
        <Redirect push to="/error" />
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        isAdmin: state.role === roles.ADMINISTRATOR
    }
}

export default connect(mapStateToProps)(Register);