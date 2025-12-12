import { socket } from '@/shared/socket'
import { Middleware } from '@reduxjs/toolkit'
import { setMatch, setRoomFull, startGameSuccess } from './game.slice'
import {
	joinRoomSuccess,
	roomCreatedSuccess,
	setError,
	setSocketConnected
} from './session.slice'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketMiddleware: Middleware = store => next => (action: any) => {
	if (action.type === 'session/initSocket') {
		if (!socket.connected) socket.connect()

		socket.on('connect', () => {
			console.log('✅ WS Connected:', socket.id)
			store.dispatch(setSocketConnected(true))
		})

		socket.on('disconnect', () => {
			console.log('❌ WS Disconnected')
			store.dispatch(setSocketConnected(false))
		})

		socket.on('roomCreated', data => {
			const payload = typeof data === 'string' ? JSON.parse(data) : data
			console.log('🎉 Комната создана:', payload)
			store.dispatch(roomCreatedSuccess(payload))
		})

		socket.on('joinedSuccess', data => {
			const payload = typeof data === 'string' ? JSON.parse(data) : data
			store.dispatch(joinRoomSuccess(payload))
		})

		socket.on('playerJoined', () => {
			store.dispatch(setRoomFull())
		})

		socket.on('gameStarted', data => {
			const payload = typeof data === 'string' ? JSON.parse(data) : data
			console.log('🎉 Комната создана:', payload)
			store.dispatch(startGameSuccess(payload.movies))
		})

		socket.on('matchFound', data => {
			const payload = typeof data === 'string' ? JSON.parse(data) : data
			console.log('Мэтч!!!', payload)
			store.dispatch(
				setMatch({
					id: payload.movieId,
					title: payload.movieTitle,
					poster_path: payload.moviePoster,
					overview: payload.message
				})
			)
		})

		socket.on('error', data => {
			console.error('WS Error:', data)
			store.dispatch(setError(data.message))
		})
	}

	if (socket.connected && action.meta?.emit) {
		console.log('Отправляю в сокет:', action.meta.emit, action.payload)
		socket.emit(action.meta.emit, action.payload)
	}

	return next(action)
}
