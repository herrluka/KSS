function MatchesList(props) {
    return (
        <div className="container text-center py-3 w-50">
                {props.matches.map(match => {
                    let matchPlayed = true;
                    if (match.tim_A_koseva === 0 && match.tim_B_koseva === 0) {
                        matchPlayed = false;
                    }
                    return (
                        <>
                            <table key={match.id} className="table table-bordered table-dark table-sm w-100 text-center">
                                <tbody>
                                    {match.odlozeno?<tr className="bg-danger">
                                        <td colSpan={2} >ODLOZENO</td>
                                    </tr>:null}
                                    <tr>
                                        <td colSpan={2} >{match.datum_odrzavanja===null?"-":match.datum_odrzavanja}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-50">{match.klub_A===null?'-':match.klub_A.ime}</td>
                                        <td className="w-50">{match.klub_B===null?'-':match.klub_B.ime}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-50">{matchPlayed?match.tim_A_koseva:"-"}</td>
                                        <td className="w-50">{matchPlayed?match.tim_B_koseva:"-"}</td>
                                    </tr>
                                    <tr className="text-left">
                                        <td colSpan={2}> Sudije: {match.prvi_sudija===null?'':match.prvi_sudija?.ime + ' ' + match.prvi_sudija?.prezime}
                                             {match.drugi_sudija===null?'':' , ' + match.drugi_sudija?.ime + ' ' + match.drugi_sudija?.prezime}</td>
                                    </tr>
                                    {props.isAdmin ? <tr className="text-left">
                                        <td colSpan={2}> Ažurirao: {match.korisnik === null ? '' : match.korisnik.ime + ' ' + match.korisnik.prezime}</td>
                                    </tr>:null
                                    }
                                </tbody>
                            </table>
                            {props.isAdmin||props.isDelegate?
                                <div className="text-center mb-5">
                                    <button className="btn btn-primary"
                                            onClick={() => props.handleOpenEditDialog(match.id, match.klub_A,
                                                                                      match.klub_B, match.tim_A_koseva,
                                                                                      match.tim_B_koseva, match.prvi_sudija,
                                                                                      match.drugi_sudija, match.korisnik,
                                                                                      match.datum_odrzavanja, match.odlozeno)}>
                                        Uredi
                                    </button>
                                    {props.isAdmin ?
                                        <button className="btn btn-danger"
                                                onClick={() => props.handleOpenDeleteDialog(match.id)}>Obriši</button>
                                        :
                                        null
                                    }
                                </div>
                                :
                                null
                            }
                        </>
                    )}
                )}
        </div>
    )
}

export default MatchesList;