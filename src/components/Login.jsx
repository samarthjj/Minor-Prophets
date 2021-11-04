import React, {Component, useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";

//From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
// Handles post request to backend API to verify existence of account
async function LoginUser(credentials) {
     return fetch("/api/login", {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(credentials)
     })
         .then(data => data.json())
}

async function SignupUser(credentials) {
     return fetch("/api/signup", {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(credentials)
     })
         .then(data => data.json())
}

function Login({setToken}) {


    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    const [username, setUsername] = useState(0);
    const [password, setPassword] = useState(0);

    //separate state for if a user is trying to sign up
    const [repeatPassword, setRepeatPassword] = useState(0);

    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    // Calls post request (above) to pass through the username and password input.
    const handleLoginSubmit = async e => {
        e.preventDefault();
        // If any fields are left blank, do not submit
        if (username === 0 || password === 0) {
            return
        }
        const token = await LoginUser({
          username,
          password
        });
        if (token.token !== undefined) {
            setToken(token);
        } else {
            document.getElementById("login_notice").innerHTML = "Invalid login."
        }
    }

    //From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
    // Calls post request (above) to pass through the username and password input.
    const handleSignUpSubmit = async e => {
        e.preventDefault();
        // If any fields are left blank, do not submit
        if (username === 0 || password === 0 || repeatPassword === 0){
            return
        }
        if (username.length > 16) {
            document.getElementById("signup_notice").innerHTML = "Username is too long."
            return
        }
        const token = await SignupUser({
          username,
          password,
            repeatPassword
        });
        console.log(token.token)
        if (token.token === "badUsername"){
            document.getElementById("signup_notice").innerHTML = "Username is already taken."
        } else if (token.token === "invalidUsername"){
            document.getElementById("signup_notice").innerHTML = "Username is invalid."
        } else if (token.token === "badPassword") {
            document.getElementById("signup_notice").innerHTML = "Password does not follow the requirements."
        } else if (token.token === "passwordMatchError") {
            document.getElementById("signup_notice").innerHTML = "Passwords do not match."
        }else if (token.token !== undefined) {
            setToken(token);
        } else {
            document.getElementById("signup_notice").innerHTML = "Please follow the above requirements."
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
                <h6 className="text-light" >Note: You will not be redirected if you use invalid login credentials or attempt to sign up with a username that is already in use.</h6>
            </div>

            {/* Bootstrap Spacing: https://getbootstrap.com/docs/5.1/utilities/spacing/*/}
            {/*Centering content w/ mx-auto (automatic X centering)*/}
            {/*mb-3 == margin bottom by 3*/}

            <h5 className="text-light">Login</h5>
            <div class="container-sm">
                <form className="form-group" onSubmit={handleLoginSubmit}>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" onChange={e => setUsername(e.target.value)} className="form-control input-small" placeholder="Username"/>
                        <label htmlFor="username" class="text-dark">Username</label>
                    </div>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="password" onChange={e => setPassword(e.target.value)} className="form-control input-small" placeholder="Password"/>
                        <label htmlFor="username" className="text-dark">Password</label>
                    </div>

                    <h6 className="text-light" id = "login_notice"> </h6>
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

            <h5 className="text-light">Sign Up</h5>
            <h6 className="text-light">Usernames must be no more than 16 characters and must contain no whitespace.</h6>
            <h6 className="text-light">Passwords must be at least 8 characters with no whitespace and must contain each of the following:</h6>
            <h8 className="text-light">capital letter - lowercase letter - number - special character [!@#$%^&*()]</h8>
            <div className="container-sm">
                <form className="form-group" onSubmit={handleSignUpSubmit}>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" onChange={e => setUsername(e.target.value)}
                               className="form-control input-small" placeholder="Username"/>
                        <label htmlFor="username" className="text-dark">Username</label>
                    </div>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="password" onChange={e => setPassword(e.target.value)}
                               className="form-control input-small" placeholder="Password"/>
                        <label htmlFor="username" className="text-dark">Password</label>
                    </div>
                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="password" onChange={e => setRepeatPassword(e.target.value)}
                               className="form-control input-small" placeholder="Re-enter Password"/>
                        <label htmlFor="username" className="text-dark">Re-enter Password</label>
                    </div>
                    <h6 className="text-light" id = "signup_notice"> </h6>
                    <div className="form-floating mb-3 mx-5">
                        <button className="btn btn-lg btn-success text-dark" type="submit">Sign Up</button>
                        {/*https://reactrouter.com/web/api/Redirect*/}
                        <Redirect to='/creategame'/>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default Login;

// From tutorial: //https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
Login.propTypes = {
    setToken: PropTypes.func.isRequired
};