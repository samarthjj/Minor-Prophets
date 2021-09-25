// import logo from './logo.svg';
import './App.css';
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Landing from "./components/Landing";
import NotFound from './components/NotFound';

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={NotFound} />
          <Route exact path="/signup" component={NotFound} />
          <Route exact path="/TBD" component={NotFound} />
        </Switch>
      </Router>
  );
}

export default App;
