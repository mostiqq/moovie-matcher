'use client'

import { makeStore } from '@/store/store'
import { ReactNode, useEffect, useState } from 'react'
import { Provider } from 'react-redux'

function Providers({ children }: { children: ReactNode }) {
	const [store] = useState(() => makeStore())

	useEffect(() => {
		store.dispatch({ type: 'session/initSocket' })
	}, [store])

	return <Provider store={store}>{children}</Provider>
}
export default Providers
