import {useEffect, useState} from "react";
import roles from "../../constants";

function UserDialog(state) {

    const [availableRoles, setAvailableRoles] = useState([]);

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

    return (
        <>
            <div id="editUserModal" className={"centered w-25 fade show " + (state.isDialogShown?"d-block ":"d-none")} >
                <div className="modal-dialog w-100">
                    <div className="modal-content">
                        <form onSubmit={event => state.onValidateForm(event)}>
                            <div className="modal-header">
                                <h4 className="modal-title">Izmenite korisnika</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                        onClick={() => state.closeDialog()}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Ime</label>
                                    <input type="text" className="form-control" name="name" required
                                           onChange={event => state.onInputChange(event)}
                                           value={state.user.name}/>
                                </div>
                                <div className="form-group">
                                    <label>Prezime</label>
                                    <input type="text" className="form-control" name="surname" required
                                           onChange={event=> state.onInputChange(event)}
                                           value={state.user.surname}/>
                                </div>
                                <div className="form-group">
                                    <label>Uloga</label>
                                    <select className="form-control" name="role"
                                           onChange={event=> state.onInputChange(event)} required
                                           value={state.user.role}>
                                        {availableRoles.map(role => {
                                            return (
                                                <option key={role.key} value={role.value}>{role.value}</option>
                                            )
                                        })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Napusti"
                                       onClick={() => state.closeDialog()}/>
                                <input type="submit" className="btn btn-success" value="Potvrdi" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {state.isDialogShown?<div className="modal-backdrop fade show"  style={{zIndex: 1040}} onClick={() => state.closeDialog()} />:null}
        </>
    )
}

export default UserDialog;