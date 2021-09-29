// import logo from './logo.svg';
import './App.css';
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Landing from "./components/Landing";
import NotFound from './components/NotFound';
import CreateGame from "./components/CreateGame";
import GameSetup from "./components/GameSetup";

// To add more CSS files to the page, do "import '.css'"
// This directly inserts the CSS into the page through React's render() method
import './css/Landing.css';

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/creategame" component={CreateGame} />
          <Route exact path="/gamesetup" component={GameSetup} />
          <Route exact path="/login" component={NotFound} />
          <Route exact path="/signup" component={NotFound} />
          <Route exact path="/TBD" component={NotFound} />
        </Switch>
      </Router>
  );
}

export default App;
