import React, {useState, useContext, useEffect} from 'react';
import { SocketContext} from '../socket';
import "../css/Messenger.css"


const Messenger = ({ room_code }) => {
  const socket = useContext(SocketContext);
  const token = document.cookie.split("=")[1]

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {

    socket.on('connect', () => {
      console.log(`${socket.id} connected`);
    })
  
    socket.on('message', info => {
      console.log("Message Event FRONTEND")
      setMessages([...messages, `${info["username"]}: ${info["message"]}`])
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
    if (message.length !== 0){
      socket.emit('message', {"room": room_code, "token": token, "message": message});
      setMessage("");
    } else{
      alert("Please type a message!")
    }
  };

  return (
    <div className="Messenger">
      <h1 className="text-light">Messages</h1>
      <ul className="messages bg-success bg-gradient p-2 text-dark bg-opacity-25 overflow-auto border border-light border-3 rounded">
        {messages.map(msg => 
          (<li className="list-group-item text-dark" key={msg}>
            {msg}
            </li>
          ))}
      </ul>
    <div className="d-flex">
      <input className="form-control" placeholder="Type your message here!" type="text" onChange={onChange} value={message}/>
      <input className="btn btn-primary ms-3" type="button" onClick={onClick} value="Send"/>
    </div>
    </div>
  );
};

export default Messenger;