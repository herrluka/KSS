import SearchWithoutButton from "../common/search/SearchWithoutButton";

function RefereeHeader(props) {
    return (
        <>
            <h1 className="my-5 text-center">Sudije</h1>
            <SearchWithoutButton search={(_search_text) => props.searchReferees(_search_text)} searchPlaceholder={"Pretražite sudije po imenu"}/>
        </>
    )
}

export default RefereeHeader;