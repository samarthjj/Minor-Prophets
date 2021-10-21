import React, {Component} from "react";
import {Link} from "react-router-dom";

class Answer extends Component {
    render() {
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
                        <Link to="/question"><button className="btn btn-primary btn-md text-dark mb-3">New Question</button></Link>
                    </div>
                    <div className="col-2">
                        <Link to="/gameover"><button className="btn btn-primary btn-md text-dark mb-3">Game Over</button></Link>
                    </div>
                </div>

                {/*Answer and Countdown*/}
                <div className="row mb-3">
                    <div className="col">
                        <button className="btn btn-danger btn-md text-dark mb-3" disabled>The Answer Was: 2018</button>
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

            </div>
        );
    }
}

export default Answer;