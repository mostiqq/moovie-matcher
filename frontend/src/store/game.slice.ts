import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Movie {
	id: number
	title: string
	poster_path: string
	overview?: string
	rating?: number
}

interface GameState {
	status: 'lobby' | 'playing' | 'match'
	movies: Movie[]
	matchMovie: Movie | null
	isRoomFull: boolean
}

const initialState: GameState = {
	status: 'lobby',
	movies: [],
	matchMovie: null,
	isRoomFull: false
}

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		startGameSuccess: (state, action: PayloadAction<Movie[]>) => {
			state.movies = action.payload
			state.status = 'playing'
		},
		setMatch: (state, action: PayloadAction<Movie>) => {
			state.matchMovie = action.payload
			state.status = 'match'
		},
		resetGame: state => {
			state.status = 'lobby'
			state.movies = []
			state.matchMovie = null
		},
		setRoomFull: state => {
			state.isRoomFull = true
		}
	}
})

export const startGameEmit = (roomCode: string) => ({
	type: 'game/startGameEmit',
	meta: { emit: 'startGame' },
	payload: { roomCode }
})

export const likeMovieEmit = (
	roomCode: string,
	movieId: number,
	movieTitle: string,
	moviePoster: string
) => ({
	type: 'game/likeMovieEmit',
	meta: { emit: 'likeMovie' },
	payload: { roomCode, movieId, movieTitle, moviePoster }
})

export const { setMatch, startGameSuccess, resetGame, setRoomFull } =
	gameSlice.actions
export default gameSlice.reducer
