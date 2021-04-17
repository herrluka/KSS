import { useEffect, useState } from 'react';
import {getClubs, saveCLub, updateClub, deleteClub} from "./ClubService";
import ModalLoader from "../common/loaders/ModalLoader";
import RetryError from "../common/errors/RetryError";
import roles from "../../constants";
import {connect} from "react-redux";
import ClubDialog from "./ClubDialog";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import ClubsListForAdmin from "./ClubsListForAdmin";
import ClubHeader from "./ClubHeader";
import ClubHeaderForAdmin from "./ClubHeaderForAdmin";
import ClubsList from "./ClubsList";
import SearchWithoutButton from "../common/search/SearchWithoutButton";


function Clubs(props) {

    const [clubs, setClubs] = useState([]);
    const [shownClubs, setShownClubs] = useState([]);
    const [loaderActive, setLoaderActive] = useState(false);
    const [dialogMode, setDialogMode] = useState('CREATE');
    const [isServerErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isDialogShown, setDialogShown] = useState(false);
    const [isContentLoaded, setContentLoaded] = useState(false);
    const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
    const [deleteDialogCLubId, setDeleteDialogCLubId] = useState(null);
    const clubDialogInitialState = {
        id: '',
        name: '',
        foundationYear: '',
        address: '',
        phone: '',
    };
    const [clubInDialog, setClubInDialog] = useState(clubDialogInitialState);
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});
    
    function fetchData() {
        getClubs(props.token).then(response => {
            setClubs(response.data.content);
            setContentLoaded(true);
            setShownClubs(response.data.content);
        }).catch(error => {
            setServerErrorOccurred(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    function retryGettingClubs() {
        setLoaderActive(true);
        setServerErrorOccurred(false);
        setContentLoaded(false);
        fetchData();
    }

    function handleChange(event) {
        setClubInDialog({
            ...clubInDialog,
            [event.target.name]: event.target.value
        })
    }

    function openInsertDialog() {
        setDialogMode('CREATE');
        setClubInDialog(clubDialogInitialState);
        setDialogShown(true);
    }

    function openEditDialog(_id, _name, _foundationYear, _address, _phone) {
        setClubInDialog({
            ...clubInDialog,
            id: _id,
            name: _name,
            foundationYear: _foundationYear,
            address: _address,
            phone: _phone,
        });
        setDialogMode('EDIT');
        setDialogShown(!isDeleteDialogShown);
    }

    function openDeleteDialog(leagueId) {
        setDeleteDialogCLubId(leagueId);
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

    function insertExistingClub(event) {
        saveCLub({
            name: clubInDialog.name,
            foundation_year: clubInDialog.foundationYear,
            address: clubInDialog.address,
            phone_number: clubInDialog.phone,
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


    function updateExistingClub(event) {
        updateClub(clubInDialog.id, {
            name: clubInDialog.name,
            foundation_year: clubInDialog.foundationYear,
            address: clubInDialog.address,
            phone_number: clubInDialog.phone,
        }, props.token).then(response => {
            setDialogShown(false);
            showSuccessAlert();
            const updatedClubs = clubs.map(club => {
                if (club.id === clubInDialog.id) {
                    return {
                        id: clubInDialog.id,
                        naziv_kluba: clubInDialog.name,
                        godina_osnivanja: clubInDialog.foundationYear,
                        adresa_kluba: clubInDialog.address,
                        broj_telefona: clubInDialog.phone
                    }
                } else {
                    return club;
                }
            });
            setClubs(updatedClubs);
            setShownClubs(updatedClubs);
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        })
    }

    function handleDialogValidation(event) {
        setLoaderActive(true);
        event.preventDefault();
        if (dialogMode === 'CREATE') {
            insertExistingClub(event)
        } else {
            updateExistingClub(event);
        }
    }

    function deleteExistingClub(id) {
        setLoaderActive(true);
        deleteClub(id, props.token).then(response => {
            showSuccessAlert();
            setDeleteDialogShown(false);
            const updatedClubs = clubs.filter(club => club.id !== id);
            setClubs(updatedClubs);
            setShownClubs(updatedClubs);
        }).catch(error => {
            showErrorAlert();
        }).finally(() => {
            setLoaderActive(false);
        });
    }

    function searchClubs(searchText) {
        setShownClubs(clubs.filter(club => club.naziv_kluba.toLowerCase().startsWith(searchText)));
    }

    if (isServerErrorOccurred) {
        return <RetryError isActive={isServerErrorOccurred} retry={() => retryGettingClubs()} />
    }

    if (!isContentLoaded) {
        return <ModalLoader isActive={true} />
    }

    if (props.isAdmin) {
        return (
            <>
                <ModalLoader isActive={loaderActive} />
                <ClubHeaderForAdmin openInsertDialog={() => openInsertDialog()} />
                <SearchWithoutButton searchPlaceholder="Pretražite klubove po nazivu" search={(searchText) => searchClubs(searchText)} />
                <ClubsListForAdmin clubs={shownClubs} handleChangeEvent={event => handleChange(event)}
                                   openDeleteDialogEvent={(clubId) => openDeleteDialog(clubId)}
                                   openEditDialogEvent={(clubId, clubName, clubFoundationYear, clubAddress, clubPhone) =>
                                       openEditDialog(clubId, clubName, clubFoundationYear, clubAddress, clubPhone)}/>
                <ClubDialog club={clubInDialog} mode={dialogMode} closeDialog={() => setDialogShown(!isDialogShown)}
                            isDialogShown={isDialogShown} onInputChange={event => handleChange(event)}
                            onValidateForm={event => handleDialogValidation(event)}/>
                <DeleteDialog isDialogShown={isDeleteDialogShown}
                               closeDialog={() => setDeleteDialogShown(!isDeleteDialogShown)}
                whatToDelete="korisnika"
                confirmDelete={() => deleteExistingClub(deleteDialogCLubId)}/>
                <SuccessAlert alertStyle={successAlertStyle} alertText="Uspešno ažuriran korisnik!" />
                <ErrorAlert alertStyle={errorAlertStyle} alertText="Korisnik nije ažuriran!" />
            </>
        )
    } else {
        return (
            <>
                <ModalLoader isActive={loaderActive} />
                <ClubHeader />
                <SearchWithoutButton searchPlaceholder="Pretražite klubove po nazivu" search={(searchText) => searchClubs(searchText)} />
                <ClubsList clubs={shownClubs} />
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAdmin: state.role === roles.ADMINISTRATOR,
        token: state.token
    }
}

export default connect(mapStateToProps)(Clubs);
