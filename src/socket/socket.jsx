import * as io from 'socket.io-client';
let PORT = process.env.PORT || 5000
export const socket = io.connect(`http://0.0.0.0:${PORT}`, {transports: ['websocket']});