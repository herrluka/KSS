import SearchWithoutButton from "../common/search/SearchWithoutButton";

function RefereeHeader(props) {
    return (
        <>
            <h1 className="pt-4 mb-5 text-center">Sudije</h1>
            <SearchWithoutButton search={(_search_text) => props.searchReferees(_search_text)} searchPlaceholder={"Pretražite sudije po imenu"}/>
        </>
    )
}

export default RefereeHeader;