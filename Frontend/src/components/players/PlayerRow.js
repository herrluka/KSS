import { Link } from 'react-router-dom';

function PlayerRow(props) {
    return (
        <tr key={props.playerId}>
            <td>{props.playerName}</td>
            <td>{props.playerSurname}</td>
            <td>{props.playerDateOfBirth}</td>
            {props.isAdmin?<td className="border-top-0 text-left w-15">
                <Link to={'players/' + props.playerId} type={'button'}>
                    Više detalja
                </Link>
            </td>:null}
        </tr>
    )
}

export default PlayerRow;