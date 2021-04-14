import {Link} from "react-router-dom";

function UsersList(props) {
    return (
        <div className="container-fluid justify-content-center mt-5 text-center w-100">
            <table className="table">
                <thead className="bg-primary">
                <tr className="text-center">
                    <th className="text-light" scope="col">Ime</th>
                    <th className="text-light" scope="col">Prezime</th>
                    <th className="text-light" scope="col">Korisničko ime</th>
                    <th className="text-light" scope="col">Uloga</th>
                    <th className="text-light" scope="col">Operacije</th>
                </tr>
                </thead>
                <tbody>
                {props.users.map(_user => {
                    return (
                        <tr key={_user.id}>
                            <td >{_user.ime}</td>
                            <td>{_user.prezime}</td>
                            <td>{_user.korisnicko_ime}</td>
                            <td>{_user.uloga}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => props.openEditDialogEvent(_user.id, _user.ime, _user.prezime, _user.uloga)}>Uredi</button>
                                <button className="btn btn-danger" onClick={() => props.openDeleteDialogEvent(_user.id)}>Obriši</button>
                                <Link to={"change-password/" + _user.id} className="btn btn-success">Promena lozinke</Link>
                            </td>
                        </tr>
                    )}
                )}
                </tbody>
            </table>
        </div>
    )
}

export default UsersList;