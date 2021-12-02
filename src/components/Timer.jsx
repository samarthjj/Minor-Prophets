import React, {useEffect, useState} from "react";

const Timer = () => {

    const initialSeconds = 30

    const [seconds, setSeconds ] =  useState(initialSeconds)

    // Timer code adapted from this tutorial
    //https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
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

    return (
        <div className="col">
            <button className="btn btn-primary btn-md text-dark mb-3" disabled>{seconds} Seconds Remaining</button>
        </div>
    )
}

export default Timer