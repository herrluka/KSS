import { Link } from 'react-router-dom';

function PlayerRow(state) {
    return (
        <tr key={state.playerId}>
            <td scope="row">{state.playerName}</td>
            <td>{state.playerSurname}</td>
            <td>{state.playerDateOfBirth}</td>
            {state.isAdmin?<td className="border-top-0 text-left w-15">
                <Link to={'players/' + state.playerId} type={'button'}>
                    Više detalja
                </Link>
            </td>:null}
        </tr>
    )
}

export default PlayerRow;