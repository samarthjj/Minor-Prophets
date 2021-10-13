import React, { useState } from 'react';
import io from "socket.io-client";

let api = "http://0.0.0.0:5000";
let socket = io.connect(api, {transports: ["websocket"]}, {secure: true});

const Messenger = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  socket.on("message", msg => {
    setMessages([...messages, msg])});

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const onClick = () => {
      console.log(message);
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div className="App">
        <h1 className="text-light">Messages</h1>
        <div className="text-light">
        {messages.map(msg => (<p>{msg}</p>))}
    </div>
    <input type="text" onChange={onChange} value={message} />
    <input type="button" onClick={onClick} value="Send"/>
    </div>
  );
};

export default Messenger;