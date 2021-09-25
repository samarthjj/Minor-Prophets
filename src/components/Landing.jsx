import React, {Component} from "react";
import {Link} from "react-router-dom";

class Landing extends Component {
    render() {
        return (
            <div>
                <h1>Minor Prophets</h1>
                <h2>This is our landing page, aka the first page.</h2>
                <Link to="/login"><button>Login</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
                <div class="langing-logo">
                    <h3>This is where the game logo goes.</h3>
                </div>
                <input className="code" type="text" value="hGjU87Uj" disabled />
                <Link to="/TBD"><button>Join Game</button></Link>
                <Link to="/TBD"><button>Start New Game</button></Link>
            </div>
        );
    }
}

export default Landing;