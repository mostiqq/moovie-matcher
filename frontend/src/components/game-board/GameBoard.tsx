'use client'
import { likeMovieEmit, Movie } from '@/store/game.slice'
import { AppDispatch, RootState } from '@/store/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TinderCard from 'react-tinder-card'
import styles from './GameBoard.module.scss'

function GameBoard() {
	const { movies } = useSelector((state: RootState) => state.game)
	const { roomId } = useSelector((state: RootState) => state.session)
	const [lastDirection, setLastDirection] = useState<string>()
	const dispatch = useDispatch<AppDispatch>()

	const swiped = (direction: string, movie: Movie) => {
		setLastDirection(direction)

		if (direction === 'right' && roomId) {
			dispatch(likeMovieEmit(roomId, movie.id, movie.title, movie.poster_path))
		}
	}
	return (
		<div className={styles.board}>
			<div className={styles.cardContainer}>
				{movies.map(movie => (
					<TinderCard
						key={movie.id}
						className={styles.swipe}
						onSwipe={dir => swiped(dir, movie)}
						preventSwipe={['up', 'down']}
					>
						<div
							className={styles.card}
							style={{ backgroundImage: `url(${movie.poster_path})` }}
						>
							<div className={styles.cardInfo}>
								<h3 className={styles.movieTitle}>{movie.title}</h3>
								{movie.rating && (
									<span className={styles.movieRating}>★ {movie.rating}</span>
								)}
							</div>
						</div>
					</TinderCard>
				))}
			</div>
			{lastDirection && (
				<div className={styles.swipeInfo}>
					Последний свайп:{' '}
					{lastDirection === 'right' ? '❤️ Лайк' : '❌ Пропуск'}
				</div>
			)}
		</div>
	)
}
export default GameBoard
