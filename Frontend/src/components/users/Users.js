import { useEffect, useState } from 'react';
import {getUsers, updateUser, deleteUser} from "./UserService";
import ModalLoader from "../common/loaders/ModalLoader";
import {Link, Redirect} from "react-router-dom";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
// import SuccessAlert from "../alerts/SuccessAlert";
// import ErrorAlert from "../alerts/ErrorAlert";
import UserRow from "./UserRow";
import UserDialog from "./UserDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";


function Users(props) {

    const [users, setUsers] = useState([]);
    const [loaderActive, setLoaderActive] = useState(true);
    const [retryButtonDisplayed, setRetryButtonDisplayed] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
    const [deleteDialogUserId, setDeleteDialogUserId] = useState(null);
    const [userInDialog, setUserInDialog] = useState({
        id: '',
        name: '',
        surname: '',
        userName: '',
        role: '',
    });
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});

    useEffect(() => {
        getUsers(props.token).then(response => {
            setUsers(response.data.content);
        }).catch(error => {
            setRetryButtonDisplayed(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }, []);

    function retryGettingUsers() {
        setLoaderActive(true);
        setRetryButtonDisplayed(false);
        getUsers(props.token).then(response => {
            setUsers(response.data.content);
        }).catch(error => {
            setRetryButtonDisplayed(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function handleChange(event) {
        setUserInDialog({
            ...userInDialog,
            [event.target.name]: event.target.value
        })
    }

    function openEditDialog(_id, _name, _surname, _role) {
        setUserInDialog({
            ...userInDialog,
            id: _id,
            name: _name,
            surname: _surname,
            role: _role,
        });
        setDialogShown(!isDeleteDialogShown);
    }

    function openDeleteDialog(leagueId) {
        setDeleteDialogUserId(leagueId);
        setDeleteDialogShown(!isDeleteDialogShown);
    }

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

    function updateExistingUser(event) {
        event.preventDefault();
        setLoaderActive(true);
        updateUser(userInDialog.id, {
            name: userInDialog.name,
            surname: userInDialog.surname,
            role: userInDialog.role
        }, props.token).then(response => {
            setDialogShown(false);
            showSuccessAlert();
            retryGettingUsers();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function deleteExistingUser(id) {
        setLoaderActive(true);
        deleteUser(id, props.token).then(response => {
            showSuccessAlert();
            setDeleteDialogShown(false);
            retryGettingUsers();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        });
    }

    if (props.isAdmin) {
        return (
            <>
                <ModalLoader isActive={loaderActive} />
                <RetryError isActive={retryButtonDisplayed} retry={() => retryGettingUsers()} />
                <h1 className="text-center pt-4 mb-5">Korisnici</h1>
                <div className="mr-5 m-5 text-center">
                    <Link to="/register" className="btn btn-success">
                        <div className="d-flex">
                            <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faPlusSquare} />Dodaj korisnika
                        </div>
                    </Link>
                </div>
                <div className="container-fluid justify-content-center mt-5 text-center w-100">
                    <table className="table">
                        <thead className="bg-primary">
                        <tr className="text-center">
                            <th className="text-light" scope="col">Ime</th>
                            <th className="text-light" scope="col">Prezime</th>
                            <th className="text-light" scope="col">Korisničko ime</th>
                            <th className="text-light" scope="col">Uloga</th>
                        </tr>
                        </thead>
                        <tbody>
                            {users.map(_user => {
                                return (
                                    <UserRow user={_user} handleChange={event => handleChange(event)}
                                    openEditDialog={() => openEditDialog(_user.id, _user.ime, _user.prezime, _user.uloga)}
                                    openDeleteDialog={() => openDeleteDialog(_user.id) } />
                                )}
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <UserDialog closeDialog={() => setDialogShown(!isDialogShown)} user={userInDialog}
                            isDialogShown={isDialogShown} onInputChange={event => handleChange(event)}
                onValidateForm={event => updateExistingUser(event)}/>
                <DeleteDialog  isDialogShown={isDeleteDialogShown}
                               closeDialog={() => setDeleteDialogShown(!isDeleteDialogShown)}
                whatToDelete="korisnika"
                confirmDelete={() => deleteExistingUser(deleteDialogUserId)}/>
                <SuccessAlert alertStyle={successAlertStyle} alertText="Uspešno ažuriran korisnik!" />
                <ErrorAlert alertStyle={errorAlertStyle} alertText="Korisnik nije ažuriran!" />
            </>
        )
    } else {
        return <Redirect push to="/error" />
    }
}


function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token
    }
}

export default connect(mapStateToProps)(Users);
