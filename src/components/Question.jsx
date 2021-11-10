import React, {useState, useEffect, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import {default as axios} from "axios";
import { SocketContext} from '../socket';
import Messenger from './Messenger'

function get_question() {
    axios.get('/api/questionRequest', {
        params: {

        }
    })
    .then(function (response) {
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
        // console.log(response)
        document.getElementById("question").innerHTML = response.data["question"];
        document.getElementById("choice1").innerHTML = response.data["choices"][0]; //This gets the answer choices correctly
        document.getElementById("choice2").innerHTML = response.data["choices"][1];
        document.getElementById("choice3").innerHTML = response.data["choices"][2];
        document.getElementById("choice4").innerHTML = response.data["choices"][3];
    })
}

const Question = () => {

    const socket = useContext(SocketContext);

    const { room_code } = useParams();

    const initialSeconds = 30

    const [seconds, setSeconds ] =  useState(initialSeconds)

    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                clearInterval(myInterval)
            }
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    });

    get_question()

    useEffect(() => {

        socket.on('join_room', (info) => {
          console.log(info);
        })

        socket.on('leave_room', (info) => {
            console.log(info);
          })

        // socket.emit("join_room", {"room": room_code, "token": document.cookie.split("=")[1]})
      
        return () => {
            //Use this space to clean up any effects.
        }
        
      })

    return (
        <div class="container-sm text-center">

            {/*Button Row*/}
            <div className="row mb-3">
                <div className="col-8">

                </div>
                <div className="col-2">
                    <Link to="/creategame"><button class="btn btn-success btn-md text-dark mb-3">Quit</button></Link>
                </div>
                <div className="col-2">
                    <Link to={`/answer/${room_code}`}><button className="btn btn-primary btn-md text-dark mb-3">Countdown Done</button></Link>
                </div>
            </div>

            {/*Question + Timer*/}
            <div className="row mb-3">
                <div className="col">
                    <button className="btn btn-danger btn-lg text-dark mb-3" id="question" disabled></button>
                </div>
                <div className="col">
                    <button className="btn btn-primary btn-md text-dark mb-3" disabled>{seconds} Seconds Remaining</button>
                </div>
            </div>

            {/*Answer Choices + Chat*/}
            <div className="row mb-3">
                <div className="col">
                    <div className="row mb-3">
                        <div className="col">
                            <input type="radio" className="btn-check mb-3" name="options" id="option1"
                                    autoComplete="off"/>
                            <label className="btn btn-primary" htmlFor="option1" id="choice1"></label>
                        </div>
                        <div className="col">
                            <input type="radio" className="btn-check btn-lg mb-3" name="options" id="option2"
                                    autoComplete="off"/>
                            <label className="btn btn-primary" htmlFor="option2" id="choice2"></label>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <input type="radio" className="btn-check" name="options" id="option3" autoComplete="off"/>
                            <label className="btn btn-primary" htmlFor="option3" id="choice3"></label>
                        </div>
                        <div className="col">
                            <input type="radio" className="btn-check" name="options" id="option4" autoComplete="off"/>
                            <label className="btn btn-primary" htmlFor="option4" id="choice4"></label>
                        </div>
                    </div>
                </div>

                <Messenger room_code={room_code}/>

            </div>

        </div>
    );
}

export default Question;