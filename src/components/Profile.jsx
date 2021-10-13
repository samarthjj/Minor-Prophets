import React, {Component} from "react";
import {Link} from "react-router-dom";

class Profile extends Component {
    render() {
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
                <div className="row mb-3">
                    <h2 className="text-light">Username</h2>
                </div>

                {/*Statistics*/}
                <div className="row mb-3">
                    <div className="col-3">
                        <h3 className="text-light">Games won: </h3>
                    </div>
                    <div className="col-3">
                        <h3 className="text-light">Total points earned: </h3>
                    </div>
                    <div className="col-3">
                        <h3 className="text-light">Win/loss ratio: </h3>
                    </div>
                    <div className="col-3">
                        <h3 className="text-light">Favorite genre: </h3>
                    </div>
                </div>

                {/*Your Songs and Link Spotify/Apple Music*/}
                <div className="row mb-3">

                    <div className="col-6">
                        <table className="table table-striped table-light">
                            <thead>
                            <tr>
                                <th scope="col">Your Songs</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Never Gonna Give You Up - Rick Astley</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-6">
                        <div className="row">
                            <Link to="/TBD"><button className="btn btn-light btn-md text-dark mb-3">Link Spotify</button></Link>
                            <img src="" alt="Spotify image"/>
                        </div>
                        <div className="row">
                            <Link to="/TBD"><button className="btn btn-light btn-md text-dark mb-3">Link Apple Music</button></Link>
                            <img src="" alt="Apple Music image"/>
                        </div>
                    </div>

                </div>

                <div className="row mb-3">

                </div>

                <div className="row mb-3">

                </div>

            </div>
        );
    }
}

export default Profile;