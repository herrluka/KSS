import { useEffect, useState, useCallback } from 'react';
import { getAll } from "../home/HomeService";
import ModalLoader from "../common/loaders/ModalLoader";
import {Link} from "react-router-dom";
import RetryError from "../common/errors/RetryError";

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
            <ModalLoader isActive={loaderActive} />
            <RetryError isActive={retryButtonDisplayed} retry={() => retryGettingLeagues()} />
            <h1 className="text-center pt-4 mb-5">Lige KSS-a</h1>
            <div className="container-fluid text-center align-content-center overflow-auto mb-5">
                {leagues.map(league => {
                    return (
                        <h5><Link to={"leagues/" + league.id} key={league.id}>{league.naziv_lige}</Link></h5>
                    )
                })}
            </div>
        </>
    )
}

export default League;