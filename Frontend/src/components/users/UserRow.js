import {Link} from "react-router-dom";

function UserRow(props) {
    return (
        <tr key={props.user.id}>
            <td >{props.user.ime}</td>
            <td>{props.user.prezime}</td>
            <td>{props.user.korisnicko_ime}</td>
            <td>{props.user.uloga}</td>
            <td>
                <button className="btn btn-primary" onClick={() => props.openEditDialog()}>Uredi</button>
                <button className="btn btn-danger" onClick={() => props.openDeleteDialog()}>Obriši</button>
                <Link to={"change-password/" + props.user.id} className="btn btn-success">Promena lozinke</Link>
            </td>
        </tr>
    )
}

export default UserRow;