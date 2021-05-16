import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./reducers/rootReducer";
import axios from "../src/api/axios";

let token = localStorage.getItem('Token');
let userName = localStorage.getItem('userName');
let userId = null;
let role = null;
axios.get('/auth/validate-token', {headers: {authorization: 'Bearer ' + token}}).then(response => {
    if(!response.data.content.userId) {
        token = null;
        role = null;
        userId = null;
        userName = null;
    } else {
        userId = response.data.content.userId;
        role = response.data.content.role;
    }
}).catch(error => {
    userId = null;
    role = null;
    userName = null;
    token = null;
}).finally(() => {
    const store = createStore(rootReducer);
    ReactDOM.render(
        <React.StrictMode>
            <Router>
                <Provider store={store}><App token={token} userName={userName} role={role} userId={userId} /></Provider>
            </Router>
        </React.StrictMode>,
        document.getElementById('root')
    );
});


