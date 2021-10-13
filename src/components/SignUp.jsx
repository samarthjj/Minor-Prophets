import React from "react";
import {Link} from "react-router-dom";

function SignUp() {

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

            {/*https://javascript.plainenglish.io/sending-a-post-to-your-flask-api-from-a-react-js-app-6496692514e*/}
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
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" className="form-control input-small" id="name" placeholder="ReenterPassword"/>
                        <label htmlFor="username" className="text-dark">Re-enter Password</label>
                    </div>

                    <h3 className="text-light" id="test">Test</h3>
                    <div className="form-floating mb-3 mx-5">
                        <button className="btn btn-lg btn-success text-dark" type="submit"
                                onClick = {async () => {
                                    const signup_info = "test1"
                                    const response = fetch("/api/signup", {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(signup_info)
                                    })
                                    if (response.ok){
                                        console.log("failed")
                                        document.getElementById("test").attribute = "True"
                                        // <Link to={"/creategame"}></Link>
                                    }
                                    console.log(response)
                        }}>Sign Up</button>
                    </div>

                    <div className="form-floating mb-3 mx-5">
                        <Link to="/"><button className="btn btn-lg btn-success text-dark" type="submit">Login</button></Link>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default SignUp;