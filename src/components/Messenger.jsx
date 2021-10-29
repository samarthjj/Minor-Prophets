import React, { useState } from 'react';
import { socket } from '../socket'


const Messenger = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");


  socket.off('connect').on('connect', () => {
    console.log("User connected");
  })

  socket.off('message').on('message', msg => {
    console.log(msg);
    setMessages([...messages, msg])});

    socket.off('disconnect').on('disconnect', () => {
      console.log("User disconnected");
    })

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const onClick = () => {
    socket.emit('message', message);
    setMessage("");
  };

  return (
    <div className="App">
      <h1 className="text-light">Messages</h1>
      <div className="text-light">
        {messages.map(msg => 
          (<p key={msg}>
            {msg}
            </p>
          ))}
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