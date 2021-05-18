import {useEffect, useState} from 'react';
import {Redirect, useHistory, useParams} from "react-router-dom";
import RetryError from "../common/errors/RetryError";
import Loader from "../common/loaders/Loader";
import {connect} from "react-redux";
import {getUserById} from "./UserService";
import roles from "../../constants";
import ModalLoader from "../common/loaders/ModalLoader";
import {changePassword} from "./UserService";

function ChangePassword(props) {
    const [formFields, setFormFields] = useState({
        'password': "",
        'repeatPassword': ""
    });
    const [showError, setShowError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [isLoaderShown, setLoaderShown] = useState(false);
    const [isSmallLoaderShown, setSmallLoaderShown] = useState(false);
    const [isUserFetched, setUserFetched] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: ''
    });
    const history = useHistory();
    const params = useParams();

    function handleChange(event) {
        setFormFields({
            ...formFields,
            [event.target.name]: event.target.value
        })
    }


    function handleChangePassword(event) {
        event.preventDefault();
        if (formFields.password !== formFields.repeatPassword) {
            setShowError(true);
            return;
        }
        setSmallLoaderShown(true);
        changePassword(user.id, {
            password: formFields.password
        }, props.token).then(response => {
            if (response.status === 204) {
                if (user.id === props.currentUserId) {
                    history.push('/login');
                    props.emptyAuthData();
                    return;
                }
                history.push('/users');
            }
        }).catch(error => {
            setSmallLoaderShown(false);
            setServerError(true);
        })
    }

    function fetchUser() {
        setLoaderShown(true);
        getUserById(params.userId, props.token).then(response => {
            setUser({
                id: response.data.content.id,
                name: response.data.content.ime + " " + response.data.content.prezime,
            });
            setLoaderShown(false);
            setUserFetched(true);
        }).catch(error => {
            setServerError(true);
            setLoaderShown(false);
        })
    }

    useEffect(() => {
        fetchUser();
    }, []);

    function tryAgain() {
        setServerError(false);
        fetchUser();
    }

    if (props.isAdmin) {
        if (!isUserFetched) {
            return (
                <div>
                    <ModalLoader isActive={isLoaderShown} />
                </div>
            )
        }
        if (serverError){
            return <RetryError isActive={true} retry={() => tryAgain()} />
        } else {
            return (
                <div className="form-signin-container text-center h-75">
                        <form className="form-signin" onSubmit={event => handleChangePassword(event)}>
                            <h1 className="h3 mb-3 font-weight-normal">Promenite lozinku za korisnika {user.name}</h1>
                            <label htmlFor="inputPassword" className="sr-only">Lozinka</label>
                            <input type="password" id="inputPassword" className="form-control" placeholder="Lozinka"
                                   required name="password" onChange={(event => handleChange(event))} />
                            <label htmlFor="inputRepeatPassword" className="sr-only">Ponovljena lozinka</label>
                            <input type="password" id="inputRepeatPassword" className="form-control" placeholder="Ponovite lozinku"
                                   required name="repeatPassword" onChange={(event => handleChange(event))} />
                            {showError?<label className="text-danger">Lozinke se ne poklapaju!</label>:null}
                            <Loader isActive={isSmallLoaderShown} />
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Promenite lozinku</button>
                        </form>
                    <ModalLoader isActive={isLoaderShown} />
                </div>
        )}
    } else {
        return <Redirect push to="/error" />
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        isAdmin: state.role === roles.ADMINISTRATOR,
        currentUserId: state.userId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        emptyAuthData: () => {dispatch({type: 'SET_AUTH_FIELDS', token: null, userName: null,
            role: null, userId: null})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);