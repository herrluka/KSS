import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


function Search(props) {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="row justify-content-center mt-2 w-100">
            <div className="col-12 col-md-10 col-lg-8">
                <div className="card card-sm">
                    <div className="card-body row no-gutters align-items-center">
                        <div className="col-auto">
                            <FontAwesomeIcon className="h4 text-body mr-2" icon={faSearch} />
                        </div>
                        <div className="col">
                            <input className="form-control form-control-lg form-control-borderless" type="search"
                                   placeholder="Pretražite igrače po imenu" onChange={(event => setSearchText(event.target.value))} />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-lg btn-primary" onClick={() => props.searchPlayers(searchText)}>Traži</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;