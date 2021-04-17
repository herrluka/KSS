import {useState} from "react";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ContractDialog(props) {

    const [isDropdownShown, setDropdownShown] = useState(false);
    const playerNameInDropdownIntial = 'Izaberite igrača';
    const [playerNameInDropdown, setPlayerNameInDropdown] = useState(playerNameInDropdownIntial);
    const [playerNotChosenError, setPlayerNotChosenError] = useState(false);

    function handlePlayerChange(event, playerId, playerName, playerSurname) {
        event.preventDefault();
        setPlayerNameInDropdown(playerName + ' ' + playerSurname);
        event.name =
        event.target.name = 'playerId';
        event.target.value = playerId;
        props.onInputChange(event);
        setDropdownShown(false);
    }

    function validateForm(event) {
        event.preventDefault();
        if (props.contract.playerId === null) {
            setPlayerNotChosenError(true);
            return;
        } else {
            setPlayerNotChosenError(false);
        }
        setPlayerNameInDropdown(playerNameInDropdownIntial);
        props.onValidateForm();
    }

    return (
        <>
            <div id="contractModal" className={"centered w-25 fade show " + (props.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content" style={{maxHeight: '80vh'}}>
                        <form onSubmit={event => validateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">Angažujte igrača</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => props.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Igrač</label>
                                    <div className="dropdown w-100">
                                        <button className="btn btn-primary w-100" type="button"
                                                id="dropdownMenuButton" onClick={() => setDropdownShown(!isDropdownShown)}>
                                            <span className="float-left">{playerNameInDropdown}</span>
                                            <span className="float-right">
                                                <FontAwesomeIcon className="h4 mr-2 mb-0" icon={faChevronDown} /></span>
                                        </button>
                                        <div className={isDropdownShown?
                                            'dropdown-menu overflow-auto w-100 bg-primary py-0 position-relative show'
                                            :
                                            'dropdown-menu overflow-auto w-100 bg-primary py-0  position-relative'} style={{maxHeight:'25vh'}}>
                                            <input type="text" placeholder="Pretražite igrače" className="w-100"
                                                   onKeyUp={event => props.filterDisplayedPlayers(event.target.value)} />
                                            {props.displayedPlayers.map(player => {
                                                return <button key={player.id}
                                                               className='btn btn-primary w-100 text-white text-left'
                                                               onClick={event => handlePlayerChange(event, player.id, player.ime, player.prezime)}>
                                                    {player.ime + ' ' + player.prezime}
                                                </button>
                                            })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Datum angažovanja</label>
                                    <input type="date" className="form-control" name="contractDate" required
                                           onChange={event=> props.onInputChange(event)}
                                           value={props.contract.contractDate}/>
                                </div>
                                {playerNotChosenError?
                                <label className="text-danger text-center font-weight-bold w-100">Morate da izaberete igrača</label>
                                    :null
                                }
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Napusti"
                                       onClick={() => props.closeDialog()}/>
                                <input type="submit" className="btn btn-success" value="Potvrdi" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {props.isDialogShown?<div className="modal-backdrop fade show"  style={{zIndex: 1040}} onClick={() => props.closeDialog()} />:null}
        </>
    )
}

export default ContractDialog;