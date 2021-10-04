import React, {Component} from "react";
import {Link} from "react-router-dom";

// https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
// Followed guide on how to add a Flask backend
// https://reactjs.org/docs/hooks-rules.html
// https://reactjs.org/docs/components-and-props.html --> good site for React Components (functions are == to classes)

import {useState, useEffect} from "react";

// Really good for React Hooks: https://reactjs.org/docs/faq-ajax.html (2nd example on page - BUT MISSING SOMETHING!)

function Database() {

    // Time Example (of how to do the API calls)
    const [currentTime, setCurrentTime] = useState(0); // Explained in the 'blog.miguelgrinberg' link

    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);

    // Database
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("/db")
            .then(res => res.json())
            .then(
                (result) => {
                    setItems(result.users); // Was missing '.items' to get the JS Array portion of the JSON string!
                },                          // .<insert> is the key from the JSON data we want.
            )
    }, []);

    return (
        <div class="text-center">

            <h2 className="text-light">Database Entries:</h2>
            <ul>
                {items.map(item => (
                    <li className="text-light">
                        {item.username} : {item.name}
                    </li>
                ))}
            </ul>

            <br/>
            <p className="text-light">Example API call w/ time to Flask Backend:</p>
            <p className="text-light">The current time is {currentTime}.</p>

        </div>
    );
}

export default Database;

// <li key={item.id} className="text-light"></li>