import React from 'react';
import HomePage from "./components/home/Home";
import NotFoundPage from "./NotFoundPage";
import Navbar from "./components/common/navbar/Navbar";
import { Route, Switch } from "react-router-dom";
import Login from "./components/login/Login";
import Register from  "./components/register/Register";
import League from "./components/league/League";
import Players from "./components/players/Players";

function App() {
    return (
        <>
        <Navbar />
        <Switch>
            <Route path="/players" exact component={Players} />
            <Route path="/leagues" exact component={League} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/" exact component={HomePage} />
            <Route component={NotFoundPage} />
        </Switch>
    </>
    )
}

export default App;