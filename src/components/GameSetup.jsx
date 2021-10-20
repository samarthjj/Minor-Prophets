import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";


class GameSetup extends Component {

    constructor() {
        super();

        //https://axios-http.com/docs/post_example
        axios.post('/api/startGame', {
            rounds: 5
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log("startGame failed");
            });

        //https://www.positronx.io/react-radio-button-tutorial-with-example/
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue = (e) => {
        return axios.post('/api/startGame');
    }

    render() {

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
                            <Link to="/question"><button className="btn btn-primary btn-md text-dark mb-3">Start Game</button></Link>
                        </div>
                    </div>

                    {/*Code Header and Number of Rounds Selector*/}
                    <div className="row mb-3">
                        <div className="col-3">
                            <h1 className="text-light">CODE</h1>
                        </div>
                        <div className="col-9">

                            <div className="row">
                                <h2 className="text-light">Number of Rounds</h2>
                            </div>

                            <div className="row">

                                {/*https://getbootstrap.com/docs/5.0/components/button-group/
                                https://www.pluralsight.com/guides/how-to-use-radio-buttons-in-reactjs*/}
                                <div onChange={this.onChangeValue}>
                                    <input type="radio" className="btn-check" name="btnradio" value="1" id="btnradio1" autoComplete="off"/>
                                        <label className="btn btn-success text-dark" htmlFor="btnradio1">1</label>

                                    <input type="radio" className="btn-check" name="btnradio" value="2" id="btnradio2" autoComplete="off"/>
                                        <label className="btn btn-success text-dark" htmlFor="btnradio2">2</label>

                                    <input type="radio" className="btn-check" name="btnradio" value="3" id="btnradio3" autoComplete="off"/>
                                        <label className="btn btn-success text-dark" htmlFor="btnradio3">3</label>

                                    <input type="radio" className="btn-check" name="btnradio" value="4" id="btnradio4" autoComplete="off"/>
                                    <label className="btn btn-success text-dark" htmlFor="btnradio4">4</label>

                                    <input type="radio" className="btn-check" name="btnradio" value="5" id="btnradio5" autoComplete="off"/>
                                    <label className="btn btn-success text-dark" htmlFor="btnradio5">5</label>
                                </div>

                            </div>
                        </div>
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

                        <div className="col-9">
                            <div class="row">
                                <h2 className="text-light">Select Genre</h2>
                            </div>

                            {/*https://getbootstrap.com/docs/5.0/forms/checks-radios/#radio-toggle-buttons*/}

                            <div class="row">
                                <div class="col">
                                    <input type="radio" className="btn-check mb-3" name="options" id="option1" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option1">Metal</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check btn-lg mb-3" name="options" id="option2" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option2">Rap & Hip Hop</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check" name="options" id="option3" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option3">Country</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check" name="options" id="option4" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option4">Pop</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check" name="options" id="option5" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option5">Indie</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check" name="options" id="option6" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option6">Jazz</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check" name="options" id="option7" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option7">Classic Rock</label>
                                </div>
                                <div className="col">
                                    <input type="radio" className="btn-check" name="options" id="option8" autoComplete="off"/>
                                    <label className="btn btn-primary" htmlFor="option8">Electronic</label>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="row mb-3">

                    </div>

                </div>

            </div>
        );
    }
}

export default GameSetup;