import React from 'react';
import HomePage from "./components/home/Home";
import NotFoundPage from "./NotFoundPage";
import Navbar from "./components/common/navbar/Navbar";
import { Route, Switch } from "react-router-dom";
import Login from "./components/login/Login";
import Register from  "./components/register/Register";
import League from "./components/league/League";
import Players from "./components/players/Players";
import PlayerInfo from "./components/players/PlayerInfo";
import Users from "./components/users/Users";
import ChangePassword from "./components/users/ChangePassword";
import Referee from "./components/referees/Referee";
import RefereeInfo from "./components/referees/RefereeInfo";
import LeagueRounds from "./components/rounds/LeagueRounds";
import Matches from "./components/matches/Matches";
import Clubs from "./components/clubs/Clubs";
import Contract from "./components/contract/Contract";

function App() {
    return (
        <>
        <Navbar />
        <Switch>
            <Route path="/rounds/:id/matches" component={Matches} />
            <Route path="/referees/:id" component={RefereeInfo} />
            <Route path="/referees" component={Referee} />
            <Route path="/change-password/:userId" component={ChangePassword} />
            <Route path="/users/" component={Users} />
            <Route path="/players/:id" component={PlayerInfo} />
            <Route path="/players" component={Players} />
            <Route path="/clubs/:id/players" component={Contract} />
            <Route path="/clubs" component={Clubs} />
            <Route path="/leagues/:id" component={LeagueRounds} />
            <Route path="/leagues" component={League} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/" exact component={HomePage} />
            <Route component={NotFoundPage} />
        </Switch>
    </>
    )
}

export default App;