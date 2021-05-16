import React, {useEffect} from 'react';
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
import {connect} from "react-redux";

function App(props) {
    props.setAuthData({
        userId: props.userId,
        role: props.role,
        userName: props.userName,
        token: props.token
    });

    return (
        <>
        <Navbar />
        <Switch>
            <Route path="/rounds/:id/matches" exact component={Matches} />
            <Route path="/referees/:id" exact component={RefereeInfo} />
            <Route path="/referees" exact component={Referee} />
            <Route path="/change-password/:userId" exact component={ChangePassword} />
            <Route path="/users/" exact component={Users} />
            <Route path="/players/:id" exact component={PlayerInfo} />
            <Route path="/players" exact component={Players} />
            <Route path="/clubs/:id/players" exact component={Contract} />
            <Route path="/clubs" exact component={Clubs} />
            <Route path="/leagues/:id" exact component={LeagueRounds} />
            <Route path="/leagues" exact component={League} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/" exact component={HomePage} />
            <Route component={NotFoundPage} />
        </Switch>
    </>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        setAuthData: (user) => {
            dispatch({
                type: 'SET_AUTH_FIELDS', token: user.token,
                userName: user.userName, role: user.role,
                userId: user.userId
            })
        }
    }
}

export default connect(null, mapDispatchToProps)(App);