import { createContext } from "react";
import socketIOClient from "socket.io-client";
import { API } from './config/API/api.config';

export const socket = socketIOClient.connect(API.hostUrl, {
    transports: ['polling', 'websocket'],
    autoConnect: false
})
export const SocketContext = createContext();


socket.on('connect', () => {
    console.log('connected: ');
});
socket.on('disconnect', () => {
    console.log('disconnect: ');
});
socket.on('error', (err) => {
    console.log("Socket.IO Error");
    console.log(err.stack);
});