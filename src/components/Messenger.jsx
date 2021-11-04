import React, {useState, useContext, useEffect} from 'react';
// import { SocketContext} from '../socket';
const io = require("socket.io-client");

let endPoint = "http://localhost:5000"; // WebSocket conns made here now!
// let endPoint = "http://137.184.97.255:5000"; // (For Deployment change this line)
let socket = io.connect(`${endPoint}`);  // https://medium.com/analytics-vidhya/simple-chat-app-with-react-flask-b2ae72404fcb

const Messenger = () => {
  // const socket = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {

    socket.on('connect', () => {
      console.log(`${socket.id} connected`);
    })
  
    socket.on('message', msg => {
      console.log(msg);
      setMessages([...messages, msg])
    })

    return () => {
      socket.off('connect');
      socket.off('message');
    }
    
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