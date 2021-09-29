import React, {Component} from "react";
import {Link} from "react-router-dom";

class CreateGame extends Component {
    render() {
        return (
            <div class="text-center">
                <h1 className="title text-light">Minor Prophets</h1>

                <div className="landing-logo mb-5">
                    <h3 className="text-dark">This is where the game logo goes.</h3>
                </div>

                {/* Bootstrap Spacing: https://getbootstrap.com/docs/5.1/utilities/spacing/*/}
                {/*Centering content w/ mx-auto (automatic X centering)*/}
                {/*mb-3 == margin bottom by 3*/}

                <div className="container-sm">
                    <form className="form-group">
                        <div className="form-floating mb-3 mx-auto w-50">
                            <input type="text" className="form-control input-small" id="code" placeholder="Code"/>
                            <label htmlFor="name" className="text-dark">Enter Code Here</label>
                        </div>

                        <div className="form-floating mb-3 mx-5">
                            <Link to="/gamesetup"><button className="btn btn-lg btn-success text-dark" type="submit">Join Game</button></Link>
                        </div>

                        <div className="form-floating mb-3 mx-5">
                            <Link to="/gamesetup"><button className="btn btn-lg btn-primary text-dark" type="submit">Start New Game</button></Link>
                        </div>

                    </form>
                </div>

                {/*<h1 class="title text-light">Minor Prophets</h1>*/}
                {/*<h2>This is our landing page, aka the first page.</h2>*/}
                {/*<Link to="/login"><button class="text-dark">Login</button></Link>*/}
                {/*<Link to="/signup"><button class="text-dark">Sign Up</button></Link>*/}
                {/*<div class="landing-logo">*/}
                {/*    <h3>This is where the game logo goes.</h3>*/}
                {/*</div>*/}
                {/*<input className="code" type="text" value="hGjU87Uj" disabled />*/}
                {/*<Link to="/TBD"><button>Join Game</button></Link>*/}
                {/*<Link to="/TBD"><button>Start New Game</button></Link>*/}
            </div>
        );
    }
}

export default CreateGame;