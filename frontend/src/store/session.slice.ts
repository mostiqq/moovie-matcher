import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Session {
	isConnected: boolean
	roomId: string | null
	userId: string | null
	isAdmin: boolean
	error: string | null
}

const initialState: Session = {
	isConnected: false,
	roomId: null,
	userId: null,
	isAdmin: false,
	error: null
}

const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		setSocketConnected: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload
		},
		roomCreatedSuccess: (
			state,
			action: PayloadAction<{ roomCode: string; userId: string }>
		) => {
			state.roomId = action.payload.roomCode
			state.userId = action.payload.userId
			state.isAdmin = true
			state.error = null
		},
		joinRoomSuccess: (
			state,
			action: PayloadAction<{ roomCode: string; userId: string }>
		) => {
			state.roomId = action.payload.roomCode
			state.userId = action.payload.userId
			state.isAdmin = false
			state.error = null
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload
		}
	}
})

export const createRoomEmit = (name: string) => ({
	type: 'session/createRoomEmit',
	meta: { emit: 'createRoom' },
	payload: { name }
})

export const joinRoomEmit = (name: string, roomCode: string) => ({
	type: 'session/joinRoomEmit',
	meta: { emit: 'joinRoom' },
	payload: { name, roomCode }
})

export const {
	setSocketConnected,
	joinRoomSuccess,
	setError,
	roomCreatedSuccess
} = sessionSlice.actions

export default sessionSlice.reducer
