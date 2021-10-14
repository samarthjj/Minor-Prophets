import React, {Component} from "react";
import {Link} from "react-router-dom";

class Gameover extends Component {
    render() {
        return (
            <div class="container-sm text-center">

                {/*Button Row*/}
                <div className="row mb-3">
                    <div className="col-2">
                        <Link to="/creategame"><button className="btn btn-success btn-md text-dark mb-3">Exit</button></Link>
                    </div>
                    <div className="col-8">

                    </div>
                    <div className="col-2">
                        <Link to="/gamesetup"><button className="btn btn-success btn-md text-dark mb-3">Play Again</button></Link>
                    </div>
                </div>

                {/*Winner*/}
                <div className="row mb-3">
                    <h1 className="text text-light">Winner: Harrison</h1>
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

            </div>
        );
    }
}

export default Gameover;