import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

class Question extends Component {

    constructor() {
        super();

        // https://www.npmjs.com/package/axios
        axios.get('/api/questionRequest')
            .then(function (response) {
                // put in div
            })
            .catch(function (error) {
                console.log("questionRequest failed");
            })
    }

    componentDidMount() {

    }

    render() {
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
                    <div className="col">
                        <button className="btn btn-danger btn-md text-dark mb-3" disabled>What year did Post Malone release Beerbongs & Bentleys?</button>
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
                                <input type="radio" className="btn-check mb-3" name="options" id="option1"
                                       autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option1">2007</label>
                            </div>
                            <div className="col">
                                <input type="radio" className="btn-check btn-lg mb-3" name="options" id="option2"
                                       autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option2">2014</label>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <input type="radio" className="btn-check" name="options" id="option3" autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option3">2018</label>
                            </div>
                            <div className="col">
                                <input type="radio" className="btn-check" name="options" id="option4" autoComplete="off"/>
                                <label className="btn btn-primary" htmlFor="option4">2020</label>
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