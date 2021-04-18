import { useEffect, useState } from 'react';
import {getUsers, updateUser, deleteUser} from "./UserService";
import ModalLoader from "../common/loaders/ModalLoader";
import {Redirect} from "react-router-dom";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import UserDialog from "./UserDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import UsersList from "./UsersList";
import UserHeader from "./UserHeader";


function Users(props) {
    const [users, setUsers] = useState([]);
    const [loaderActive, setLoaderActive] = useState(true);
    const [isServerErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [isContentLoaded, setContentLoaded] = useState(false);
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
    
    function fetchData() {
        getUsers(props.token).then(response => {
            setUsers(response.data.content);
            setContentLoaded(true);
            setLoaderActive(false);
        }).catch(error => {
            setServerErrorOccurred(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }
    useEffect(() => {
      fetchData();
    }, []);

    function retryGettingUsers() {
        setLoaderActive(true);
        setServerErrorOccurred(false);
        setContentLoaded(false);
        fetchData();
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
            fetchData();
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
            fetchData();
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        });
    }

    if (!props.isAdmin) {
        return <Redirect push to="/error" />
    }

    if (isServerErrorOccurred) {
        return <RetryError isActive={isServerErrorOccurred} retry={() => retryGettingUsers()} />
    }

    if (!isContentLoaded) {
        return <ModalLoader isActive={true} />
    }

    return (
        <>
            <ModalLoader isActive={loaderActive} />
            <UserHeader />
            <UsersList users={users} handleChangeEvent={event => handleChange(event)}
                       openDeleteDialogEvent={(userId) => openDeleteDialog(userId)}
                       openEditDialogEvent={(userId, userName, userSurname, userRole) => openEditDialog(userId, userName, userSurname, userRole)} />
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
}

function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token
    }
}

export default connect(mapStateToProps)(Users);
