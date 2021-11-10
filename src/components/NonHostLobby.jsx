import React, {useEffect, useContext, useState} from "react";
import {Link, useParams} from "react-router-dom";
import { SocketContext} from '../socket';
import {default as axios} from "axios";
// import {default as axios} from "axios";

//const axios = require('axios').default;


const NonHostLobby = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    const [names, setNames] = useState([]);

    const [tokens, setTokens] = useState([]);

    const[initialize, setInitialize] = useState(false);


    // runs when the page loads to get the usernames of the players that are already in the room
    const get_existing_players = () =>  {
        axios.get('/api/initialize_table', {
            params: {
                roomcode: room_code
            }
        }).then(function (response) {
            console.log(response.data["users"]);
            for (let name of response.data["users"]){
                if (!names.includes(name)) {
                    setNames(names => [...names, name]);
                    console.log(names);
                }
            }
        })
    }

    useEffect(() => {

        const token = document.cookie.split("=")[1];

        socket.on('join_room', info => {
            info = JSON.parse(info);
            console.log(info);
            console.log(names);
            if (!names.includes(info['username']) && info['token'] != token) {
                console.log(info['username']);
                setNames([...names, info['username']]);
            }
        })

        socket.on('leave_room', (info) => {
            console.log("leaving");
        })

        // brings the player to the first question
        socket.on('question', info => {
            console.log("question signal recieved")
            const path = '/question/' + room_code;
            //https://www.w3schools.com/js/js_window_location.asp
            window.location.pathname = path;
        })


        if (!tokens.includes(token)) {
            console.log("emitting");
            socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]});
            setTokens([...tokens, token]);
        }

        return () => {

        }
     })

    if (!initialize) {
        get_existing_players();
        setInitialize(true)
    }


    //https://www.youtube.com/watch?v=dYjdzpZv5yc for the dynamic table
    return (

        <div class="text-center">

            <div class="container-sm">

                {/*Cancel Button*/}
                <div className="row mb-3">
                    <div className="col-8">

                    </div>
                    <div className="col-2">
                        <Link to="/creategame"><button class="btn btn-success btn-md text-dark mb-3">Cancel</button></Link>
                    </div>
                </div>

                {/*Players*/}

                <div className="row mb-3">
                    <div className="app-container">
                        <h2 className="text-light">Players</h2>

                        <table class="table table-striped table-success">
                            <thead>
                                <tr>
                                    <th>Name</th>
                            </tr>
                            </thead>
                            <tbody>
                                {names.map((name) => (
                                    <tr>
                                        <td>{name}</td>
                                    </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row mb-3">

                </div>

            </div>

        </div>
    );
}

export default NonHostLobby;