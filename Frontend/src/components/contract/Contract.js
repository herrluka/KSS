import {getPlayersThatPlayInClub, insertContract, deleteContract} from "./ContractService";
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import ContractDialog from "./ContractDialog";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";
import ModalLoader from "../common/loaders/ModalLoader";
import {connect} from "react-redux";
import ContractHeader from "./ContractHeader";
import ContractHeaderAdmin from "./ContractHeaderAdmin";
import ContractsList from "./ContractsList";
import ContractsListAdmin from "./ContractsListAdmin";
import DeleteDialog from "../common/dialogs/DeleteDialog";
import roles from "../../constants";
import RetryError from "../common/errors/RetryError";

let contractIdToDelete =null;
function Contract(props) {

    const [contracts, setContracts] = useState([]);
    const [playersNotInClub, setPlayersNotInClub] = useState([]);
    const [displayedPlayersNotInClub, setDisplayedPlayersNotInClub] = useState([]);
    const [isDialogShown, setDialogShown] = useState(false);
    const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
    const [isLoaderActive, setLoaderActive] = useState(false);
    const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
    const [isContentLoaded, setContentLoaded] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const contractInDialogInitialState = {
        playerId: null,
        contractDate: ''
    };
    const [contractInDialog, setContractInDialog] = useState(contractInDialogInitialState);
    const [club, setClub] = useState({
        id: null,
        name: ''
    });
    const [successAlertStyle, setSuccessAlertStyle] = useState({display: "none"});
    const [errorAlertStyle, setErrorAlertStyle] = useState({display: "none"});
    const params = useParams();

    function filterDisplayedPlayers(searchText) {
        setDisplayedPlayersNotInClub(playersNotInClub.filter(player => player.ime.toLowerCase().includes(searchText)));
    }

    function showSuccessAlert() {
        setSuccessAlertStyle({display: "block", animation: "slideToLeft 2s"});
        setTimeout(() => {
            setSuccessAlertStyle({display: "block", animation: "slideToRight 2s"});
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
        setContractInDialog({
            ...contractInDialog,
            [event.target.name]: event.target.value
        })
    }

    function handleShowingDialog() {
        setDialogShown(!isDialogShown);
        setContractInDialog(contractInDialogInitialState);
        setValidationError(null);
    }

    function saveContract() {
        setLoaderActive(true);
        setValidationError(null);
        insertContract({
            contract_date: contractInDialog.contractDate,
            club_id: club.id,
            player_id: contractInDialog.playerId
        }, props.token).then(res => {
            showSuccessAlert();
            setDialogShown(false);
            setContractInDialog(contractInDialogInitialState);
            fetchData();
        }).catch(error => {
            if (error.response.status === 400) {
                if (error.response.data.content.code === 2) {
                    setValidationError("Igrač mlađi od 18 godina ne može da bude registrovan za više od 1 kluba.");
                } else if (error.response.data.content.code === 3) {
                    setValidationError("Ugovor već postoji.")
                }
            } else if (error.response.status === 500) {
                setServerErrorOccurred(true);
                setLoaderActive(false);
            }
            showErrorAlert();
            setLoaderActive(false);
        })
    }

    function openDeleteDialog(contractId) {
        contractIdToDelete = contractId;
        setDeleteDialogShown(true);
    }

    function handleDeleteContract() {
        setLoaderActive(true);
        deleteContract(contractIdToDelete, props.token).then(response => {
            setDeleteDialogShown(false);
            showSuccessAlert();
            fetchData();
        }).catch(error => {
            showErrorAlert();
            setLoaderActive(false);
        })
    }

    function fetchData() {
        getPlayersThatPlayInClub(params.id).then(response => {
            setContracts(response.data.content.igraci_u_klubu);
            setPlayersNotInClub(response.data.content.igraci_za_angazovanje);
            setDisplayedPlayersNotInClub(response.data.content.igraci_za_angazovanje);
            setClub({
                id: response.data.content.klub.id,
                name: response.data.content.klub.naziv_kluba,
            });
            setServerErrorOccurred(false);
            setContentLoaded(true);
            setLoaderActive(false);
        }).catch(error => {
            setServerErrorOccurred(true);
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (serverErrorOccurred) {
        return <RetryError isActive={true} retry={() => fetchData()} />
    }

    if (!isContentLoaded) {
        return <ModalLoader isActive={true} />
    }

    if (props.isAdmin) {
        return (
            <>
                <ModalLoader isActive={isLoaderActive} />
                <DeleteDialog isDialogShown={isDeleteDialogShown} whatToDelete={'angažovanje'}
                              confirmDelete={() => handleDeleteContract()}
                              closeDialog={() => setDeleteDialogShown(!isDeleteDialogShown)} />
                <ContractDialog isDialogShown={isDialogShown} contract={contractInDialog}
                                onInputChange={event => handleChange(event)}
                                onValidateForm={() => saveContract()}
                                closeDialog={() => handleShowingDialog()}
                                displayedPlayers={displayedPlayersNotInClub}
                                filterDisplayedPlayers={(searchText) => filterDisplayedPlayers(searchText)}
                                validationError={validationError}/>
                <ContractHeaderAdmin clubName={club.name} openDialog={() => setDialogShown(!isDialogShown)}/>
                <ContractsListAdmin contracts={contracts} openDeleteDialog={(contractId) => openDeleteDialog(contractId)}/>
                <SuccessAlert alertStyle = {successAlertStyle} alertText="Angažovanje je uspešno sačuvano"/>
                <ErrorAlert alertStyle={errorAlertStyle} alertText="Angažovanje nije sačuvano" />
            </>
        )
    } else {
        return (
            <>
                <ModalLoader isActive={isLoaderActive} />
                <ContractHeader clubName={club.name} />

                <ContractsList contracts={contracts} />
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.token,
        isAdmin: state.role===roles.ADMINISTRATOR
    }
}

export default connect(mapStateToProps)(Contract);