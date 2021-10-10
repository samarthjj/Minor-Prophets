import React, {Component} from "react";
import {Link, Route} from "react-router-dom";

class NotFound extends Component {
    render() {
        return (
            <div>
                <h1>The Page you are looking for cannot be found.</h1>
                <Link to="/creategame"><button>Home Page</button></Link>
            </div>
        );
    }
}

export default NotFound;