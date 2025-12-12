'use client'

import { joinRoomEmit } from '@/store/session.slice'
import { AppDispatch, RootState } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styles from './JoinRoom.module.scss'

function JoinRoom() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<{ name: string; roomCode: string }>()

	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()

	const { roomId } = useSelector((state: RootState) => state.session)

	useEffect(() => {
		if (roomId) {
			router.push(`/lobby/${roomId}`)
		}
	}, [roomId, router])

	const handleSubmitBtn = (data: { name: string; roomCode: string }) => {
		dispatch(joinRoomEmit(data.name, data.roomCode.toUpperCase()))
		reset()
	}

	return (
		<div className={styles.main}>
			<Link href='/' className={styles.backLink}>
				← Назад
			</Link>

			<div className={styles.backgroundContainer}>
				<Image
					src='https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1931&auto=format&fit=crop'
					alt='Join Room Background'
					fill
					className={styles.backgroundImage}
					priority
					sizes='100vw'
				/>
				<div className={styles.overlay} />
			</div>

			<div className={styles.card}>
				<h1 className={styles.title}>Вход в комнату</h1>

				<form onSubmit={handleSubmit(handleSubmitBtn)} className={styles.form}>
					<div className={styles.inputGroup}>
						<input
							{...register('name', {
								required: {
									value: true,
									message: 'Введите имя'
								},
								minLength: {
									value: 2,
									message: 'Имя должно содержать минимум 2 символа'
								}
							})}
							className={styles.input}
							placeholder='Ваше имя'
							type='text'
							autoComplete='off'
						/>
						{errors.name && (
							<p className={styles.error}>{errors.name.message}</p>
						)}
					</div>

					<div className={styles.inputGroup}>
						<input
							{...register('roomCode', {
								required: {
									value: true,
									message: 'Введите код комнаты'
								}
							})}
							className={`${styles.input} ${styles.inputCode}`}
							placeholder='Код комнаты'
							type='text'
							autoComplete='off'
						/>
						{errors.roomCode && (
							<p className={styles.error}>{errors.roomCode.message}</p>
						)}
					</div>

					<button type='submit' className={styles.submitBtn}>
						Присоединиться
						<span className={styles.glow} />
					</button>
				</form>
			</div>
		</div>
	)
}

export default JoinRoom
