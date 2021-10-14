// import logo from './logo.svg';
import './App.css';
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Landing from "./components/Landing";
import NotFound from './components/NotFound';
import CreateGame from "./components/CreateGame";
import GameSetup from "./components/GameSetup";
import Database from "./components/Database";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import useToken from "./useToken";


// To add more CSS files to the page, do "import '.css'"
// This directly inserts the CSS into the page through React's render() method
import './css/Landing.css';

function App() {
    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    const {token, setToken} = useToken();

    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    if (!token) {
        return (
            <Router>
                <Login setToken = {setToken} />

            </Router> )
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={CreateGame} />
                {/*SignUp page is no longer in use. Login page is not accessible and only appears when a user is not logged in.*/}
                {/*<Route exact path="/login" component={Login} />*/}
                {/*<Route exact path="/signup" component={SignUp} />*/}
                <Route exact path="/creategame" component={CreateGame} />
                <Route exact path="/gamesetup" component={GameSetup} />
                <Route exact path="/database_test" component={Database} />
                <Route exact path="/login" component={NotFound} />
                <Route exact path="/signup" component={NotFound} />
                <Route exact path="/TBD" component={NotFound} />
            </Switch>
         </Router>
    );
}

export default App;
