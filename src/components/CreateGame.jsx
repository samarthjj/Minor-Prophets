import React, {useState, useEffect} from "react";
import {Link, Redirect, useHistory} from "react-router-dom";
import {default as axios} from "axios";
import { customAlphabet } from "nanoid";


const handleLogout = async e => {
    // Clear user cookie: https://newbedev.com/javascript-how-to-clear-cookies-in-javascript-code-example
    logout()
    document.cookie = document.cookie + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Force refresh to fully log out: https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react
    window.location.reload(true);
}

function logout()
{
    axios.get('/api/logout', {
        params: {
            token: document.cookie.split("=")[1]
        }
    })
}


const CreateGame = () => {

    let history = useHistory();

    const [room_code, set_room_code] = useState("");

    const generate_room_code = () => {
        return(customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz', 8)())
    }

    const handleRoom = () => {

        console.log(room_code);

        if (room_code !== ""){
            axios.get('/api/validateRoom', {
                params: {
                    roomcode: room_code,
                    token: document.cookie.split("=")[1]
                }
            }).then(function (response) {

                if (response.data["response"] === "goodRoom"){
                    console.log("good");
                    history.push(`/nonhostlobby/${room_code}`);
                }

                else{
                    set_room_code("");
                    alert("This is not a valid room code.")
                }
            })
        }
    }

    return (
        <div class="container-sm text-center">

            <div className="row mb-3">

                {/*Profile Button*/}
                <div className="col-2">
                    <Link to="/profile"><button className="btn btn-success btn-md text-dark mb-3">Profile</button></Link>
                </div>
                <div className="col-8">

                </div>

                {/*Logout Button*/}
                <div className="col-2">
                    <button onClick={handleLogout} class="btn btn-success btn-md text-dark mb-3">Logout</button>
                </div>
            </div>

            <h1 className="title text-light">Minor Prophets</h1>

            <div className="landing-logo mb-5">
                <h3 className="text-dark">This is where the game logo goes.</h3>
            </div>

            {/* Bootstrap Spacing: https://getbootstrap.com/docs/5.1/utilities/spacing/*/}
            {/*Centering content w/ mx-auto (automatic X centering)*/}
            {/*mb-3 == margin bottom by 3*/}

            <div className="container-sm">
                <h3 className="text-light">Start a new game or enter a code to join an existing game.</h3>
                <form className="form-group">

                    <div className="form-floating mb-3 mx-5">
                        <Link to={`/gamesetup/${generate_room_code()}`}><button className="btn btn-lg btn-success text-dark" type="submit">Start New Game</button></Link>
                    </div>

                    <div className="form-floating mb-3 mx-auto w-50">
                        <input type="text" className="form-control input-small" id="code" placeholder="Code" value={room_code} onChange={(event) => {set_room_code(event.target.value)}} required/>
                        <label htmlFor="name" className="text-dark">Enter Code Here</label>

                    </div>

                    <div className="form-floating mb-3 mx-5">
                        <button className="btn btn-lg btn-primary text-dark" type="button" onClick={handleRoom}>Join Game</button>
                    </div>

                </form>
            </div>

        </div>
    );
}

export default CreateGame;