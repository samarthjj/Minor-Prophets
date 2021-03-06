import React, {useEffect, useContext, useState} from "react";
import {Link, useParams} from "react-router-dom";
import { SocketContext} from '../socket';
import NonHostLobby from './NonHostLobby';
// import {default as axios} from "axios";

const axios = require('axios').default;


const GameSetup = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    const [rounds, setRounds] = useState("");

    const [flag, setFlag] = useState(false);


    //https://www.sitepoint.com/delay-sleep-pause-wait/
    const sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    // called when start game is pressed to initialize the questions and tell the other lobbies that the game is starting
    const starting = () => {

        if (rounds == ""){
            alert("You must select the number of rounds.");
        }

        else {
            get_questions();
            socket.emit('question', room_code);
            // get request doesn't get response unless you wait
            sleep(1000);
            window.location.pathname = "/question/" + room_code;
        }
    }

    // tells the backend to generate/retrieve the questions
    function get_questions() {
        console.log("generating question signal")
        axios.get('/api/startGame', {
            params: {
                // Add event listeners to extract rounds and genre to send to backend.
                roomcode: room_code
            },
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            console.log("questions were generated")
        })
    };

    // sends the backend the number of round every time a round button is pressed
    const send_rounds = (rounds) => {
        setRounds(rounds);
        console.log("sending rounds");
        axios.get('/api/initializeRounds', {
            params: {
                // Add event listeners to extract rounds and genre to send to backend.
                rounds: rounds,
                roomcode: room_code,
            }
        }).then(function (response) {
            console.log("rounds were set")
        })
    };


    useEffect(() => {

        socket.on('join_room', (info) => {
            console.log(info);
        })

        socket.on('leave_room', (info) => {
            console.log(info);
        })

        if (!flag) {
            socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]})
            setFlag(true)
        }

        return () => {
            //Use this space to clean up any effects.
        }
        
    });

    return (
        <div class="text-center">

            <div class="container-sm">

                {/*Cancel and Start Game Buttons*/}
                <div className="row mb-3">
                    <div className="col-8">

                    </div>
                    <div className="col-2">
                        <Link to="/creategame"><button class="btn btn-success btn-md text-dark mb-3">Cancel</button></Link>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary btn-md text-dark mb-3" onClick = {starting}>Start Game</button>
                    </div>
                    {/* <div className="col-2">
                        <button className="btn btn-lg btn-success text-dark" onClick = {get_questions}>Click Here To Generate Questions</button>
                    </div> */}
                </div>

                {/*Code Header and Number of Rounds Selector*/}
                <div className="row mb-3">
                    <div className="col-3">
                        <h1 className="text-light">{`Code: ${room_code}`}</h1>
                    </div>
                    <div className="col-9">

                        <div className="row">
                            <h2 className="text-light">Number of Rounds</h2>
                        </div>

                        <div className="row">

                            {/*https://getbootstrap.com/docs/5.0/components/button-group/*/}
                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input type="radio" className="btn-check" value = "1" name="btnradio" id="btnradio1" autoComplete="off" onChange={(event) => {send_rounds(event.target.value)}}/>
                                <label className="btn btn-success text-dark" htmlFor="btnradio1">1</label>

                                <input type="radio" className="btn-check" value = "2" name="btnradio" id="btnradio2" autoComplete="off" onChange={(event) => {send_rounds(event.target.value)}} />
                                <label className="btn btn-success text-dark" htmlFor="btnradio2">2</label>

                                <input type="radio" className="btn-check" value = "3" name="btnradio" id="btnradio3" autoComplete="off" onChange={(event) => {send_rounds(event.target.value)}}/>
                                <label className="btn btn-success text-dark" htmlFor="btnradio3">3</label>

                                <input type="radio" className="btn-check" value = "4" name="btnradio" id="btnradio4" autoComplete="off" onChange={(event) => {send_rounds(event.target.value)}}/>
                                <label className="btn btn-success text-dark" htmlFor="btnradio4">4</label>

                                <input type="radio" className="btn-check" value = "5" name="btnradio" id="btnradio5" autoComplete="off" onChange={(event) => {send_rounds(event.target.value)}}/>
                                <label className="btn btn-success text-dark" htmlFor="btnradio5">5</label>
                            </div>

                        </div>
                    </div>
                </div>

                {/*Players and Genre*/}
                <div className="row mb-3">

                    <NonHostLobby />
                    {/*<div className="col-3">*/}
                    {/*    <h2 className="text-light">Players</h2>*/}

                    {/*    <table class="table table-striped table-success">*/}
                    {/*        <thead>*/}
                    {/*        <tr>*/}
                    {/*            <th scope="col">Name</th>*/}
                    {/*        </tr>*/}
                    {/*        </thead>*/}
                    {/*        <tbody>*/}
                    {/*        <tr>*/}
                    {/*            <td>Josh</td>*/}
                    {/*        </tr>*/}
                    {/*        <tr>*/}
                    {/*            <td>Sam</td>*/}
                    {/*        </tr>*/}
                    {/*        <tr>*/}
                    {/*            <td>Maeve</td>*/}
                    {/*        </tr>*/}
                    {/*        <tr>*/}
                    {/*            <td>Harrison</td>*/}
                    {/*        </tr>*/}
                    {/*        <tr>*/}
                    {/*            <td>Joe</td>*/}
                    {/*        </tr>*/}
                    {/*        </tbody>*/}
                    {/*    </table>*/}
                    {/*</div>*/}

                    {/*<div className="col-9">*/}
                    {/*    <div class="row">*/}
                    {/*        <h2 className="text-light">Select Genre</h2>*/}
                    {/*    </div>*/}

                    {/*    /!*https://getbootstrap.com/docs/5.0/forms/checks-radios/#radio-toggle-buttons*!/*/}

                    {/*    <div class="row">*/}
                    {/*        <div class="col">*/}
                    {/*            <input type="radio" className="btn-check mb-3" name="options" id="option1" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option1">Metal</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check btn-lg mb-3" name="options" id="option2" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option2">Rap & Hip Hop</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check" name="options" id="option3" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option3">Country</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check" name="options" id="option4" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option4">Pop</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check" name="options" id="option5" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option5">Indie</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check" name="options" id="option6" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option6">Jazz</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check" name="options" id="option7" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option7">Classic Rock</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="col">*/}
                    {/*            <input type="radio" className="btn-check" name="options" id="option8" autoComplete="off"/>*/}
                    {/*            <label className="btn btn-primary" htmlFor="option8">Electronic</label>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                </div>


                <div className="row mb-3">

                </div>

            </div>

        </div>
    );
}

export default GameSetup;