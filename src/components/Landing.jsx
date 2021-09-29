import React, {Component} from "react";
import {Link} from "react-router-dom";

class Landing extends Component {
    render() {
        return (
            <div class="text-center">
                <h1 class="title text-light">Minor Prophets</h1>

                <div class="landing-logo mb-5">
                    <h3 class="text-dark">This is where the game logo goes.</h3>
                </div>

                {/* Bootstrap Spacing: https://getbootstrap.com/docs/5.1/utilities/spacing/*/}
                {/*Centering content w/ mx-auto (automatic X centering)*/}
                {/*mb-3 == margin bottom by 3*/}

                <div class="container-sm">
                    <form className="form-group">
                        <div className="form-floating mb-3 mx-auto w-50">
                            <input type="text" className="form-control input-small" id="name" placeholder="Name"/>
                            <label htmlFor="name" class="text-dark">Enter Name Here</label>
                        </div>

                        <div className="form-floating mb-3 mx-5">
                            <Link to="/creategame"><button className="btn btn-lg btn-success text-dark" type="submit">Submit</button></Link>
                        </div>

                    </form>
                </div>

            </div>
        );
    }
}

export default Landing;