import * as io from 'socket.io-client';
let PORT = process.env.PORT
export const socket = io.connect(`http://0.0.0.0:${PORT}`);