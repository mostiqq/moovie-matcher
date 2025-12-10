'use client'

import { createRoomEmit } from '@/store/sessionSlice'
import { AppDispatch, RootState } from '@/store/store'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styles from './CreateRoom.module.scss'

function CreateRoom() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<{ name: string }>()

	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const { roomId } = useSelector((state: RootState) => state.session)

	useEffect(() => {
		if (roomId) {
			router.push(`/lobby/${roomId}`)
		}
	}, [router, roomId])

	const handleCreateRoom = (data: { name: string }) => {
		dispatch(createRoomEmit(data.name))
		reset()
	}

	return (
		<div className={styles.main}>
			<Link href='/' className={styles.backLink}>
				← Назад
			</Link>

			<div className={styles.backgroundContainer}>
				<Image
					src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop'
					alt='Cinema Background'
					fill
					className={styles.backgroundImage}
					priority
					sizes='100vw'
				/>
				<div className={styles.overlay} />
			</div>

			<div className={styles.card}>
				<h1 className={styles.title}>Создание комнаты</h1>

				<form onSubmit={handleSubmit(handleCreateRoom)} className={styles.form}>
					<div className={styles.inputGroup}>
						<input
							{...register('name', {
								required: {
									value: true,
									message: 'Пожалуйста, введите ваше имя'
								},
								minLength: {
									value: 2,
									message: 'Имя должно быть длиннее 2 символов'
								}
							})}
							type='text'
							placeholder='Ваше имя'
							className={styles.input}
							autoComplete='off'
						/>
						{errors.name && (
							<p className={styles.error}>{errors.name.message}</p>
						)}
					</div>

					<button className={styles.submitBtn} type='submit'>
						Создать
						<span className={styles.glow} />
					</button>
				</form>
			</div>
		</div>
	)
}

export default CreateRoom
