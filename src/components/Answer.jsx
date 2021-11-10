import React, {useEffect, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import {default as axios} from "axios";
import { SocketContext} from '../socket';
import Messenger from './Messenger'


function get_answer()
{
    axios.get('/api/answerRequest', {
        params: {

        }
    })
        .then(function (response) {
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
            // console.log("yoot")
            document.getElementById("answer").innerHTML = "The Answer Was: " + response.data["answer"];
        })
}

const Answer = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    get_answer()

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
        <div class="container-sm text-center">

            {/*Button Row*/}
            <div className="row mb-3">
                <div className="col-6">

                </div>
                <div className="col-2">
                    <Link to="/creategame"><button class="btn btn-success btn-md text-dark mb-3">Quit</button></Link>
                </div>
                <div className="col-2">
                    <Link to={`/question/${room_code}`}><button className="btn btn-primary btn-md text-dark mb-3">New Question</button></Link>
                </div>
                <div className="col-2">
                    <Link to={`/gameover/${room_code}`}><button className="btn btn-primary btn-md text-dark mb-3">Game Over</button></Link>
                </div>
            </div>

            {/*Answer and Countdown*/}
            <div className="row mb-3">
                <div className="col">
                    <button className="btn btn-danger btn-lg text-dark mb-3" id="answer" disabled></button>
                </div>
                <div className="col">
                    <button className="btn btn-primary btn-md text-dark mb-3" disabled>10 seconds</button>
                </div>
            </div>

            {/*Scores and Chat*/}
            <div className="row mb-3">
                <div className="col">
                    <table className="table table-striped table-success">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Harrison</td>
                            <td>145</td>
                        </tr>
                        <tr>
                            <td>Sam</td>
                            <td>135</td>
                        </tr>
                        <tr>
                            <td>Maeve</td>
                            <td>120</td>
                        </tr>
                        <tr>
                            <td>Josh</td>
                            <td>100</td>
                        </tr>
                        <tr>
                            <td>Joe</td>
                            <td>95</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <Messenger room_code={room_code}/>
            </div>

            <div className="row mb-3">

            </div>

        </div>
    );
}

export default Answer;