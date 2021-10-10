import React, {Component, useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";

//From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
async function LoginUser(credentials) {
    // useEffect(() => {
         return fetch("/api/login", {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(credentials)
         })
             .then(data => data.json())
    // }, []);
}

function Login({setToken}) {


    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    const [username, setUsername] = useState(0);
    const [password, setPassword] = useState(0);

    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    const handleSubmit = async e => {
    e.preventDefault();
    const token = await LoginUser({
      username,
      password
    });
    if (token != "None") {
        setToken(token);
        // console.log(JSON.stringify(token))
    }
    }

    // Some elements below are from tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    // Such as onSubmit and updating useState
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
                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" onChange={e => setUsername(e.target.value)} className="form-control input-small" placeholder="Username"/>
                        <label htmlFor="username" class="text-dark">Username</label>
                    </div>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="password" onChange={e => setPassword(e.target.value)} className="form-control input-small" placeholder="Password"/>
                        <label htmlFor="username" className="text-dark">Password</label>
                    </div>

                    <div className="form-floating mb-3 mx-5">
                        <button className="btn btn-lg btn-success text-dark" type="submit">Login</button>
                        {/*https://reactrouter.com/web/api/Redirect*/}
                        <Redirect to= '/creategame' />
                    </div>
                    {/*<div className="form-floating mb-3 mx-5">*/}
                    {/*    <Link to="/signup"><button className="btn btn-lg btn-success text-dark" type="submit">Sign Up</button></Link>*/}
                    {/*</div>*/}

                </form>
            </div>

        </div>
    );
}

export default Login;

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};