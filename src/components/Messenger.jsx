import React, { useState } from 'react';
import io from "socket.io-client";

let api = "https://minor-prophets.herokuapp.com:5000";
let socket = io.connect(api, { transport: ["websocket"] });

const Messenger = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  socket.on("message", msg => {
    setMessages([...messages, msg])});

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const onClick = () => {
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div className="App">
      <h1 className="text-light">Messages</h1>
      <div className="text-light">
        {messages.map(msg => (<p>{msg}</p>))}
      </div>
      <p>
        <input type="text" onChange={onChange} value={message} />
      </p>
      <p>
        <input type="button" onClick={onClick} value="Send"/>
      </p>
    </div>
  );
};

export default Messenger;
