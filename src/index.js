import React from 'react';
import ReactDOM from 'react-dom';
import { socket, SocketContext } from './socket';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Injecting PostGres into the code to see if it works.

/* This seems to render the "App.js" function inside the HTML 'root' element*/
ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <App />
  </SocketContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
