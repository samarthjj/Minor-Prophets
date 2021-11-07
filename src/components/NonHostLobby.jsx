import React, {useEffect, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import { SocketContext} from '../socket';
// import {default as axios} from "axios";

//const axios = require('axios').default;

const NonHostLobby = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    useEffect(() => {

        socket.on('join_room', (info) => {
            console.log(info);
        })

        socket.on('leave_room', (info) => {
            console.log(info);
        })

        socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]})

        return () => {
            socket.emit("leave_room", {"room": room_code, "token": document.cookie.split("=")[1]})
            socket.off('join_room');
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
                    {/* <div className="col-2">
                        <button className="btn btn-lg btn-success text-dark" onClick = {get_questions}>Click Here To Generate Questions</button>
                    </div> */}
                </div>

                {/*Players and Genre*/}
                <div className="row mb-3">
                    <div className="col-3">
                        <h2 className="text-light">Players</h2>

                        <table class="table table-striped table-success">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Josh</td>
                            </tr>
                            <tr>
                                <td>Sam</td>
                            </tr>
                            <tr>
                                <td>Maeve</td>
                            </tr>
                            <tr>
                                <td>Harrison</td>
                            </tr>
                            <tr>
                                <td>Joe</td>
                            </tr>
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