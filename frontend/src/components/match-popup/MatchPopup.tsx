'use client'

import { RootState } from '@/store/store'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './MatchPopup.module.scss'

function MatchPopup() {
	const [isImageReady, setIsImageReady] = useState(false)
	const movie = useSelector((state: RootState) => state.game.matchMovie)

	useEffect(() => {
		const duration = 3000
		const end = Date.now() + duration

		const frame = () => {
			confetti({
				particleCount: 5,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ['#46e891', '#ffffff']
			})
			confetti({
				particleCount: 5,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ['#46e891', '#ffffff']
			})

			if (Date.now() < end) {
				requestAnimationFrame(frame)
			}
		}

		frame()
	}, [])

	if (!movie) return null

	return (
		<div className={styles.overlay}>
			<h1 className={styles.title}>It&apos;s a Match!</h1>
			<h2 className={styles.movieName}>{movie.title}</h2>

			<div className={styles.posterWrapper}>
				<Image
					src={movie.poster_path}
					alt={movie.title}
					fill
					className={`${styles.poster} ${isImageReady ? styles.visible : ''}`}
					sizes='(max-width: 768px) 100vw, 320px'
					priority
					onLoad={() => setIsImageReady(true)}
				/>
			</div>

			<button className={styles.btn} onClick={() => window.location.reload()}>
				Сыграть еще раз
			</button>
		</div>
	)
}

export default MatchPopup
