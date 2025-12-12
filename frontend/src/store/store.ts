import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './game.slice'
import sessionReducer from './session.slice'
import { socketMiddleware } from './socketMiddleware'

export const makeStore = () => {
	return configureStore({
		reducer: {
			session: sessionReducer,
			game: gameReducer
		},
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(socketMiddleware)
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
