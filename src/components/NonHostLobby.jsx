import React, {useEffect, useContext, useState, component} from "react";
import {Link, useParams} from "react-router-dom";
import { SocketContext} from '../socket';
import {default as axios} from "axios";
// import {default as axios} from "axios";

//const axios = require('axios').default;


const NonHostLobby = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    const [names, setNames] = useState([]);

    const [tokens, setTokens] = useState([])

    /*
    const get_existing_players = () => {
        axios.get('/api/startGame', {
            params: {
                // Add event listeners to extract rounds and genre to send to backend.
                rounds: 5,
                roomcode: room_code
            }
        }).then(function (response) {
            console.log("received")
        })
    }
    */

    useEffect(() => {

        socket.on('join_room', info => {
            if (!names.includes(info)) {
                setNames([...names, info]);
                console.log(info);
                console.log(names);
            }
        })

        socket.on('leave_room', (info) => {
            console.log("leaving");
        })

        socket.on('question', info => {
            console.log("question signal recieved")
            const path = '/question/' + room_code;
            //https://www.w3schools.com/js/js_window_location.asp
            window.location.pathname = path;
        })

        const token = document.cookie.split("=")[1];
        console.log(tokens);
        if (!tokens.includes(token)) {
            console.log("emitting");
            socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]});
            setTokens([...tokens, token]);
        }

        return () => {

        }
     })

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
                            <!--//https://www.youtube.com/watch?v=dYjdzpZv5yc-->
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