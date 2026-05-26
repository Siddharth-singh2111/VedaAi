import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');
    }
    return socket;
};

export const getSocket = () => socket;
