import { useEffect, useState, useCallback } from 'react';
import { getAll } from "../home/HomeService";
import AboutFixed from "../common/about/AboutFixed";
import Loader from "../common/loader";
import {Link} from "react-router-dom";



function League(props) {

    const [leagues, setLeagues] = useState([]);
    const [loaderActive, setLoaderActive] = useState(true);
    const [retryButtonDisplayed, setRetryButtonDisplayed] = useState(false);

    useEffect(() => {
        getAll().then(_leagues => {
            setLeagues(_leagues.data.content);
        }).catch(error => {
            setRetryButtonDisplayed(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }, []);

    const retryGettingLeagues = useCallback(async () => {
        setLoaderActive(true);
        setRetryButtonDisplayed(false);
        getAll().then(_leagues => {
            setLeagues(_leagues.data.content);
        }).catch(error => {
            setRetryButtonDisplayed(true);
        }).finally(() => {
            setLoaderActive(false);
        })
    }, []);

    return (
        <>
            {loaderActive ?
                <div className="modal-dialog-centered position-fixed d-flex justify-content-center align-items-center w-100">
                    <Loader isActive={loaderActive}/>
                </div>:
                null
            }
            {retryButtonDisplayed ?
                <div className="modal-dialog-centered flex-column position-fixed d-flex justify-content-center align-items-center w-100">
                    <h2><span className="text-danger">Ups...</span><span>Greška se dogodila</span></h2>
                    <div>
                        <button className="btn btn-primary" onClick={retryGettingLeagues}>Pokušajte ponovo</button>
                    </div>
                </div>:
                null
            }
            <h1 className="text-center pt-4 mb-5">Lige KSS-a</h1>
            <div className="container-fluid text-center align-content-center overflow-auto">
                {leagues.map(league => {
                    return (
                        <h5><Link to={"leagues/" + league.id} key={league.id}>{league.naziv_lige}</Link></h5>
                    )
                })}
            </div>
            <AboutFixed />
        </>
    )
}

export default League;