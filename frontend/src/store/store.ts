import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'
import { socketMiddleware } from './socketMiddleware'

export const makeStore = () => {
	return configureStore({
		reducer: {
			session: sessionReducer
		},
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(socketMiddleware)
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
