import React, {useEffect, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import {default as axios} from "axios";
import { SocketContext} from '../socket';


const Answer = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    function get_answer() {
        // Disable this as soon as possible
        document.getElementById("answer").disabled = true;

        console.log("getting answer..")
        axios.get('/api/answerRequest', {
            params: {
                roomcode: room_code // This wasn't here either.... ???
            }
        }).then(function (response) {
                //https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
                // console.log("yoot")
                document.getElementById("answer").innerHTML = "The Answer Was: " + response.data["answer"];
        })
    }

    // Idea for this :: have it so every time you press a button or refresh, you can see the scores all fill in
    // We don't need to integrate WS here, but it would be nice
    // As more players enter their responses, the scoreboard will fill up
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

    function calc_score() {
        // get_answer(room_code)
        axios.get('/api/scores', {
            params: {
                roomcode: room_code
            }
        })
            .then(function (response) {

            })
    }

    // get_answer(room_code)
    // lets have this run onClick instead

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
                    <button className="btn btn-danger btn-lg text-dark mb-3" id="answer" onClick={() => {get_answer()}}>Reveal Answer</button> {/*<!-- Call the get_answer() function when it's needed -->*/}
                </div>
                <div className="col">
                    <button className="btn btn-primary btn-md text-dark mb-3" disabled>10 seconds</button>
                </div>
            </div>

            {/*Scores and Chat*/}
            <div className="row mb-3">
                <div className="col">
                    {/*<h8 className="text-light" id = "scores"> </h8>*/}
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

                {/*https://getbootstrap.com/docs/5.1/forms/form-control/#readonly-plain-text*/}
                <div className="col">
                    <form className="row">
                        {/*<div className="col-auto">*/}
                        {/*    <label htmlFor="staticEmail2" className="visually-hidden">Email</label>*/}
                        {/*    <input type="text" readOnly className="form-control-plaintext" id="staticEmail2"*/}
                        {/*           value="email@example.com"/>*/}
                        {/*</div>*/}
                        <h1 className="text-light">Chat: </h1>

                        <div className="container mx-auto">
                            <div className="col-auto">
                                <label htmlFor="chat" className="visually-hidden">Password</label>
                                <input type="text" className="form-control" id="chat" placeholder="Enter message"/>
                            </div>
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary mb-3">Send!</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row mb-3">

            </div>

            <div className="col-2">
                    <button onClick={() => calc_score(room_code)} className="btn btn-primary btn-md text-dark mb-3">Calculate Scores [Only 1 person should click this]</button>
            </div>
            <div className="col-2">
                    <button onClick={() => get_score(room_code)} className="btn btn-primary btn-md text-dark mb-3">Get Scores [Everyone should click this after scores are calculated]</button>
            </div>

        </div>
    );
}

export default Answer;