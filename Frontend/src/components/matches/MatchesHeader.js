function MatchesHeader(props) {
    return (
        <div className="text-center my-4">
            <h1>{props.round.leagueName}</h1>
            <h2 className="mt-3 font-weight-bold">{props.round.roundName}</h2>
        </div>
    )
}

export default MatchesHeader;