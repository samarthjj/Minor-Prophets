import React, {useEffect, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import { SocketContext} from '../socket';
import {default as axios} from "axios";


const Gameover = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    function get_score() {
        axios.get('/api/get_scores', {
            params: {
                roomcode: room_code
            }
        })
            .then(function (response) {
                // console.log(response.data.User)
                // console.log(response.data.Score)
                let user = response.data.User
                let score = response.data.Score
                // let output = ""
                let tableUsers = ["p1","p2","p3","p4","p5"]
                let tableScores = ["p1score","p2score","p3score","p4score","p5score"]
                for (let i=0; i<user.length && i < 5; i++) {
                    document.getElementById(tableUsers[i]).innerHTML = user[i]
                    document.getElementById(tableScores[i]).innerHTML = score[i]
                    // output += user[i] + ": " + score[i] + " "
                }
                // document.getElementById("scores").innerHTML = output

                // for (const [key, value] of Object.entries(response.data)) {
                //     console.log(key);
                //     console.log(value);
                // }
        })
    }

    get_score();

    function game_over() {
        axios.get('/api/gameOver', {
            params: {
                roomcode: room_code
            }
        })
            .then(function (response) {
                console.log(response.data);
        })
    }

    game_over();

    useEffect(() => {

        socket.on('join_room', (info) => {
          console.log(info);
        })

        socket.on('leave_room', (info) => {
            console.log(info);
          })

        // socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]})
      
        return () => {
            socket.emit("leave_room", {"room": room_code, "token": document.cookie.split("=")[1]})
            socket.off('join_room');
            socket.disconnect()
        }
        
      })

    return (
        <div class="container-sm text-center">

            {/*Button Row*/}
            <div className="row mb-3">
                <div className="col-2">
                    <Link to="/creategame"><button className="btn btn-success btn-md text-dark mb-3">Exit</button></Link>
                </div>
                <div className="col-8">

                </div>
                {/*<div className="col-2">*/}
                {/*    <Link to={`/gamesetup/${room_code}`}><button className="btn btn-success btn-md text-dark mb-3">Play Again</button></Link>*/}
                {/*</div>*/}
            </div>

            {/*Winner*/}
            <div className="row mb-3">
                <h1 className="text text-light">Game Over!</h1>
            </div>

            {/*Scoreboard*/}
            <div className="row mb-3">
                <table className="table table-striped table-success">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td id = "p1"> </td>
                            <td id = "p1score"> </td>
                        </tr>
                        <tr>
                            <td id = "p2"> </td>
                            <td id = "p2score"> </td>
                        </tr>
                        <tr>
                            <td id = "p3"> </td>
                            <td id = "p3score"> </td>
                        </tr>
                        <tr>
                            <td id = "p4"> </td>
                            <td id = "p4score"> </td>
                        </tr>
                        <tr>
                            <td id = "p5"> </td>
                            <td id = "p5score"> </td>
                        </tr>
                        </tbody>
                    </table>
            </div>

        </div>
    );
}

export default Gameover;