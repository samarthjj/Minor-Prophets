import React, {Component} from "react";
import {Link} from "react-router-dom";
import {default as axios} from "axios";

function get_question()
{
    axios.get('/api/questionRequest', {
    })
        .then(function (response) {
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
            document.getElementById("question").innerHTML = response.data.question["question"]
            document.getElementById("choice1").innerHTML = response.data.question["choices"][0]
            document.getElementById("choice2").innerHTML = response.data.question["choices"][1]
            document.getElementById("choice3").innerHTML = response.data.question["choices"][2]
            document.getElementById("choice4").innerHTML = response.data.question["choices"][3]
        })
}

class Question extends Component {
    render() {
        get_question()
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
                        <Link to="/answer"><button className="btn btn-primary btn-md text-dark mb-3">Countdown Done</button></Link>
                    </div>
                </div>

                {/*Question + Timer*/}
                <div className="row mb-3">
                    <div className="col-3">
                        <h3 className="text-light" id = "question"> </h3>
                    </div>
                    <div className="col">
                        <button className="btn btn-primary btn-md text-dark mb-3" disabled>30 seconds</button>
                    </div>
                </div>

                {/*Answer Choices + Chat*/}
                <div className="row mb-3">
                    <div className="col">
                        <div className="row mb-3">
                            <div className="col">
                                <h3 className="text-light" id = "choice1"> </h3>
                            </div>
                            <div className="col">
                                <h3 className="text-light" id = "choice2"> </h3>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <h3 className="text-light" id = "choice3"> </h3>
                            </div>
                            <div className="col">
                                <h3 className="text-light" id = "choice4"> </h3>
                            </div>
                        </div>
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

            </div>
        );
    }
}

export default Question;