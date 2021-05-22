import { useEffect, useState } from 'react';
import {getUsers, updateUser, deleteUser} from "./UserService";
import ModalLoader from "../common/loaders/ModalLoader";
import {Redirect} from "react-router-dom";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import UserDialog from "./UserDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import UsersList from "./UsersList";
import UserHeader from "./UserHeader";
import {createErrorAlert, createSuccessAlert} from "../../alertHelper";


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

    function updateExistingUser(event) {
        event.preventDefault();
        setLoaderActive(true);
        updateUser(userInDialog.id, {
            name: userInDialog.name,
            surname: userInDialog.surname,
            role: userInDialog.role
        }, props.token).then(response => {
            setDialogShown(false);
            createSuccessAlert("Korisnik ažuriran");
            fetchData();
        }).catch(error => {
            createErrorAlert("Korisnik nije ažuriran");
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function deleteExistingUser(id) {
        setLoaderActive(true);
        deleteUser(id, props.token).then(response => {
            createSuccessAlert("Korisnik je obrisan");
            setDeleteDialogShown(false);
            fetchData();
        }).catch(error => {
            createErrorAlert("Korisnik nije obrisan")
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
