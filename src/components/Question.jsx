import React, {useEffect, useContext, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {default as axios} from "axios";
import { SocketContext} from '../socket';
import Messenger from './Messenger'
import Rounds from './Rounds'
import Timer from './Timer'


const Question = () => {

    const socket = useContext(SocketContext);

    const {room_code} = useParams();

    const initialSeconds = 30

    const [seconds, setSeconds] = useState(initialSeconds)

    const [current_round, setCurrentRound] = useState("");
    const [rounds, setRounds] = useState("");


    var questionstorage = "";
    var choice1storage = "";
    var choice2storage = "";
    var choice3storage = "";
    var choice4storage = "";


    // This queries the API using the Room Code and grabs a Question for it - which is stored in the Database already
    function get_question() {

        console.log("get question called")

        axios.get('/api/questionRequest', {
            params: {
                roomcode: room_code
            }
        }).then(function (response) {
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
            // console.log(response)

            console.log("question recieved")

            questionstorage = response.data["question"];
            choice1storage = response.data["choices"][0];
            choice2storage = response.data["choices"][1];
            choice3storage = response.data["choices"][2];
            choice4storage = response.data["choices"][3];

            document.getElementById("question").innerHTML = response.data["question"];
            document.getElementById("choice1").innerHTML = response.data["choices"][0]; //This gets the answer choices correctly
            document.getElementById("choice2").innerHTML = response.data["choices"][1];
            document.getElementById("choice3").innerHTML = response.data["choices"][2];
            document.getElementById("choice4").innerHTML = response.data["choices"][3];
        })
    }

    function get_rounds() {

        axios.get('/api/rounds', {
            params: {
                roomcode: room_code
            }
        }).then(function (response) {

                console.log("rounds recieved");

                setCurrentRound(response.data["current_round"]);
                setRounds(response.data["rounds"]);

                console.log(current_round);
                console.log(rounds);
            }
        )
    }


        useEffect(() => {

            socket.on('join_room', (info) => {
                console.log(info);
            })

            socket.on('leave_room', (info) => {
                console.log(info);
            })


            // socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]})


            get_question()

            get_rounds()


            return () => {
                //Use this space to clean up any effects.
            }

        })

        function save_answer(choice) {
            console.log(choice1storage);
            axios.get('/api/saveAnswer', {
                params: {
                    answer: choice,
                    roomcode: room_code,
                    token: document.cookie.split("=")[1]
                }
            }).then(function (response) {
                console.log(response);
            })
        }

        // if (isLoading) {
        //     return (
        //         <div>
        //             <h2 className="text-light">Loading...</h2>
        //             <div id="question" hidden></div>
        //             <div id="choice1" hidden></div>
        //             <div id="choice2" hidden></div>
        //             <div id="choice3" hidden></div>
        //             <div id="choice4" hidden></div>
        //         </div>
        //     );
        // }
        // else {
        return (
            <div class="container-sm text-center">

                {/*Button Row*/}
                <div className="row mb-3">

                    <div className="col-8">
                    </div>

                    <div className="col-2">
                        <Link to="/creategame">
                            <button class="btn btn-success btn-md text-dark mb-3">Quit</button>
                        </Link>
                    </div>
                    <div className="col-2">
                        <Link to={`/answer/${room_code}`}>
                            <button className="btn btn-primary btn-md text-dark mb-3">Countdown Done</button>
                        </Link>
                    </div>
                </div>

                <Rounds current_round={current_round} rounds={rounds}/>

                {/*Question + Timer*/}
                <div className="row mb-3">
                    <div className="col">
                        <button className="btn btn-danger btn-lg text-dark mb-3" id="question" disabled></button>
                    </div>
                    <Timer />
                </div>

                {/*Answer Choices + Chat*/}
                <div className="row mb-3">
                    <div className="col">
                        <div className="row mb-3">
                            <div className="col">
                                <input type="radio" className="btn-check mb-3" name="options" id="option1"
                                       autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option1" id="choice1"
                                       onClick={() => save_answer(choice1storage)}></label> {/*Here's to hoping I get this indexing right!*/}
                            </div>
                            <div className="col">
                                <input type="radio" className="btn-check btn-lg mb-3" name="options" id="option2"
                                       autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option2" id="choice2"
                                       onClick={() => save_answer(choice2storage)}></label>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <input type="radio" className="btn-check" name="options" id="option3"
                                       autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option3" id="choice3"
                                       onClick={() => save_answer(choice3storage)}></label>
                            </div>
                            <div className="col">
                                <input type="radio" className="btn-check" name="options" id="option4"
                                       autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option4" id="choice4"
                                       onClick={() => save_answer(choice4storage)}></label>
                            </div>
                        </div>
                    </div>

                    <Messenger room_code={room_code}/>

                </div>

            </div>
        );
}

export default Question;