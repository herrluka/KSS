import React, { useEffect } from 'react';
import InfoCards from "./InfoCards";
import About from "../common/about/About";
import { getAll } from "./HomeService";

function HomePage(props) {
    useEffect(() => {
        getAll().then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        })
    });

    return (
        <div className="position-relative overflow-hidden text-center">
            <div className="col-md-5 p-lg-5 mx-auto my-5">
                <img src={require("../../assets/kss-logo.jpg").default} width={"200px"} height={"200px"}/>
                <h1 className="display-4 font-weight-normal mt-3">Košarkaški savez Srbije</h1>
            </div>
            <InfoCards />
            <About />
        </div>
    )
}

export default HomePage;