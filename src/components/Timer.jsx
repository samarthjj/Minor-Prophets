import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom"

const Timer = ({room_code}) => {

    const initialSeconds = 15

    const [seconds, setSeconds ] =  useState(initialSeconds)

    let history = useHistory()

    // Timer code adapted from this tutorial
    //https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                clearInterval(myInterval)
                history.push(`/answer/${room_code}`)
            }
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    });

    return (
        <div className="col">
            <button className="btn btn-primary btn-md text-dark mb-3" disabled>{seconds} Seconds Remaining</button>
        </div>

    )
}

export default Timer