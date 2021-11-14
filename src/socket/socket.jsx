import React from 'react';
import * as io from 'socket.io-client';
let PORT = 5000;
export const socket = io.connect(`http://localhost:${PORT}`, {transports: ['websocket']});
// export const socket = io.connect(`http://137.184.97.255:${PORT}`, {transports: ['websocket']});
export const SocketContext = React.createContext();
