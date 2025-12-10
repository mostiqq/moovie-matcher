import { io, Socket } from 'socket.io-client'

const URL = 'http://localhost:5010'

export const socket: Socket = io(URL, {
	autoConnect: false,
	transports: ['websocket']
})
