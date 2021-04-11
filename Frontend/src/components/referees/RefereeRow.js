import { Link } from 'react-router-dom';

function RefereeRow(props) {
    return (
        <tr key={props.referee.id}>
            <td>{props.referee.ime}</td>
            <td>{props.referee.prezime}</td>
            <td><Link to={"/leagues/" + props.referee.liga.id} className="text-dark">{props.referee.liga.naziv_lige}</Link></td>
            {props.isAdmin?<td className="border-top-0 text-left w-15">
                <Link to={'/referees/' + props.referee.id} type={'button'}>
                    Više detalja
                </Link>
            </td>:null}
        </tr>
    )
}

export default RefereeRow;