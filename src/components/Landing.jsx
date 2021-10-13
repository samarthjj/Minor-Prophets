import React from "react";
import {Link} from "react-router-dom";

function Landing() {

    return (
        <div class="text-center">
            <h1 class="title text-light">Minor Prophets</h1>

            <div class="landing-logo mb-5">
                <h3 class="text-dark">This is where the game logo goes.</h3>
                <h3 className="text-light">Please login or sign up below.</h3>
            </div>

            {/* Bootstrap Spacing: https://getbootstrap.com/docs/5.1/utilities/spacing/*/}
            {/*Centering content w/ mx-auto (automatic X centering)*/}
            {/*mb-3 == margin bottom by 3*/}

            <div class="container-sm">
                <form className="form-group">
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" className="form-control input-small" id="name" placeholder="Username"/>
                        <label htmlFor="username" class="text-dark">Username</label>
                    </div>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" className="form-control input-small" id="name" placeholder="ReenterPassword"/>
                        <label htmlFor="username" className="text-dark">Password</label>
                    </div>

                    <div className="form-floating mb-3 mx-5">
                        <Link to="/creategame"><button className="btn btn-lg btn-success text-dark" type="submit">Login</button></Link>
                    </div>
                    <div className="form-floating mb-3 mx-5">
                        <Link to="/signup"><button className="btn btn-lg btn-success text-dark" type="submit">Sign Up</button></Link>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default Landing;