import React, {Component} from "react";
import {Link} from "react-router-dom";

//From Axios tutorial: https://www.npmjs.com/package/axios
const axios = require('axios').default;

//From Axios tutorial: https://www.npmjs.com/package/axios
//Gets profile information for logged in user
function get_profile()
{
    axios.get('/api/stats', {
        params: {
            token: document.cookie.split("=")[1]
        }
    })
        .then(function (response) {
            // Update each of the elements with the correct information
            // Updating HTML: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
            document.getElementById("GamesWon").innerHTML = response.data.GamesWon
            document.getElementById("TotalPoints").innerHTML = response.data.TotalPoints
            document.getElementById("Ratio").innerHTML = response.data.WinRatio
            // document.getElementById("Genre").innerHTML = response.data.FavoriteGenre

            document.getElementById("username").innerHTML = "Username: " + response.data.Username;
        })
}

class Profile extends Component {
    render() {
        get_profile()
        return (
            <div class="container-sm text-center">

                {/*Button Row*/}
                <div className="row mb-3">
                    <div className="col-2">
                        <Link to="/creategame"><button className="btn btn-success btn-md text-dark mb-3">Back</button></Link>
                    </div>
                    <div className="col-8">

                    </div>
                </div>

                {/*Username (and icon?)*/}
                <div className="row mb-5">
                    <h2 className="text-light" id="username"> </h2>
                </div>

                {/*Statistics*/}
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="text-light">Number of Games Played: </h3>
                    </div>
                    <div className="col">
                        <h3 className="text-light" id = "Ratio"> </h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="text-light">Number of Questions Correct: </h3>
                    </div>
                    <div className="col">
                        <h3 className="text-light" id = "TotalPoints"> </h3>
                    </div>
                    {/*<div className="col-3">*/}
                    {/*    <h3 className="text-light">Favorite genre: </h3>*/}
                    {/*</div>*/}
                    {/*<div className="col-3">*/}
                    {/*    <h3 className="text-light" id = "Genre"> </h3>*/}
                    {/*</div>*/}
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <h3 className="text-light">Number of Wins: </h3>
                    </div>
                    <div className="col">
                        <h3 className="text-light" id = "GamesWon"> </h3>
                    </div>
                </div>

                {/*Your Songs and Link Spotify/Apple Music*/}
                {/*<div className="row mb-3">*/}

                {/*    <div className="col-6">*/}
                {/*        <table className="table table-striped table-light">*/}
                {/*            <thead>*/}
                {/*            <tr>*/}
                {/*                <th scope="col">Your Songs</th>*/}
                {/*            </tr>*/}
                {/*            </thead>*/}
                {/*            <tbody>*/}
                {/*            <tr>*/}
                {/*                <td>Never Gonna Give You Up - Rick Astley</td>*/}
                {/*            </tr>*/}
                {/*            </tbody>*/}
                {/*        </table>*/}
                {/*    </div>*/}

                {/*    <div className="col-6">*/}
                {/*        <div className="row">*/}
                {/*            <Link to="/TBD"><button className="btn btn-light btn-md text-dark mb-3">Link Spotify</button></Link>*/}
                {/*            /!*<img src="" alt="Spotify image"/>*!/*/}
                {/*        </div>*/}
                {/*        <div className="row">*/}
                {/*            <Link to="/TBD"><button className="btn btn-light btn-md text-dark mb-3">Link Apple Music</button></Link>*/}
                {/*            /!*<img src="" alt="Apple Music image"/>*!/*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*</div>*/}

                <div className="row mb-3">

                </div>

                <div className="row mb-3">

                </div>

            </div>
        );
    }
}

export default Profile;