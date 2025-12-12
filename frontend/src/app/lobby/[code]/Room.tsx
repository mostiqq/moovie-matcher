'use client'

import GameBoard from '@/components/game-board/GameBoard'
import MatchPopup from '@/components/match-popup/MatchPopup'
import { startGameEmit } from '@/store/game.slice'
import { AppDispatch, RootState } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Room.module.scss'

function Room({ code }: { code: string }) {
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const [copied, setCopied] = useState(false)

	const { userId, isAdmin } = useSelector((state: RootState) => state.session)
	const { status, isRoomFull } = useSelector((state: RootState) => state.game)

	useEffect(() => {
		if (!userId) {
			router.replace('/')
		}
	}, [userId, router])

	const copyCode = () => {
		navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleStartGame = () => {
		dispatch(startGameEmit(code))
	}

	if (!userId) return null

	if (status === 'match') return <MatchPopup />

	if (status === 'playing') return <GameBoard />

	return (
		<div className={styles.main}>
			<Link href='/' className={styles.backLink}>
				← На главную
			</Link>

			<div className={styles.backgroundContainer}>
				<Image
					src='https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=2070&auto=format&fit=crop'
					alt='Lobby Background'
					fill
					className={styles.backgroundImage}
					priority
					sizes='100vw'
				/>
				<div className={styles.overlay} />
			</div>

			<div className={styles.card}>
				<h1 className={styles.title}>Комната ожидания</h1>

				<div
					className={styles.codeContainer}
					onClick={copyCode}
					title='Скопировать'
				>
					<span className={styles.codeLabel}>Код доступа</span>
					<span className={styles.codeValue}>{code}</span>
					<span className={styles.copyHint}>
						{copied ? '✅ Скопировано!' : '(Нажми, чтобы скопировать)'}
					</span>
				</div>

				{!isRoomFull && (
					<div className={styles.status}>
						<div className={styles.loader} />
						{isAdmin && (
							<p className={styles.statusText}>Ожидаем второго игрока...</p>
						)}
					</div>
				)}

				{isAdmin && (
					<button
						disabled={!isRoomFull}
						className={styles.startBtn}
						onClick={handleStartGame}
					>
						Начать мэтчинг
						<span className={styles.glow} />
					</button>
				)}

				{!isAdmin && (
					<p className={styles.hint}>
						Админ настраивает кинотеатр... <br />
						Игра начнется автоматически.
					</p>
				)}
			</div>
		</div>
	)
}

export default Room
