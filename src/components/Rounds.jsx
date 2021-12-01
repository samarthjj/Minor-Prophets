import React, {useEffect, useContext} from "react";
import { SocketContext} from '../socket';

const Rounds = ({room_code}) => {

    const socket = useContext(SocketContext);

    useEffect(() => {

        socket.on('rounds', (info) => {
            console.log(info)
            document.getElementById("rounds").innerHTML = "Round " + info['current_round'] + " out of " + info['rounds'];
        })

        socket.emit("rounds", {"room": room_code})

        return () => {
            //Use this space to clean up any effects.
        }
    });

    return (

        <div className="container-sm text-center">

            {/*Rounds*/}
            <div className="row mb-3">
                <div className="col-7">
                    <h1 className="text-light" id = "rounds"></h1>
                </div>
            </div>

        </div>


    );
}

export default Rounds;