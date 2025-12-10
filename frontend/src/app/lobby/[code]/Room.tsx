'use client'

import { RootState } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Room.module.scss'

function Room({ code }: { code: string }) {
	const router = useRouter()
	const [copied, setCopied] = useState(false)

	const { userId, isAdmin } = useSelector((state: RootState) => state.session)

	useEffect(() => {
		if (!userId) {
			router.replace('/')
		}
	}, [userId, router])

	const copyCode = () => {
		navigator.clipboard.writeText(code)
		setCopied(true)
		// Сбрасываем надпись через 2 секунды
		setTimeout(() => setCopied(false), 2000)
	}

	const handleStartGame = () => {
		console.log('Игра началась!')
		// Тут будет dispatch(startGameEmit(code))
	}

	if (!userId) return null

	return (
		<div className={styles.main}>
			<Link href='/' className={styles.backLink}>
				← На главную
			</Link>

			<div className={styles.backgroundContainer}>
				{/* Картинка с попкорном для атмосферы ожидания */}
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

				<div className={styles.status}>
					<div className={styles.loader} />
					<p className={styles.statusText}>Ожидаем второго игрока...</p>
				</div>

				{isAdmin && (
					<button className={styles.startBtn} onClick={handleStartGame}>
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
