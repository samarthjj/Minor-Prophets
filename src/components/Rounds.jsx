import React from "react";

const Rounds = ({current_round, rounds}) => {

    return (

        <div className="container-sm text-center">

            {/*Rounds*/}
            <div className="row mb-3">
                <div className="col-7">
                    <h1 className="text-light" id = "rounds">{`Round ${current_round} out of ${rounds}`}</h1>
                </div>
            </div>

        </div>


    );
}

export default Rounds;