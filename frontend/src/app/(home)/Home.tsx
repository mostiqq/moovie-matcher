import Image from 'next/image'
import Link from 'next/link'
import styles from './Home.module.scss'

function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.backgroundContainer}>
				<Image
					src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop'
					alt='Cinema Background'
					priority
					fill
					sizes='100vw'
					className={styles.backgroundImage}
				/>
				<div className={styles.overlay} />
			</div>

			<div className={styles.content}>
				<div className={styles.textGroup}>
					<h1 className={styles.title}>
						Movie <span className={styles.highlight}>Matcher</span>
					</h1>
					<p className={styles.description}>
						Хватит спорить, что посмотреть. <br />
						Свайпайте фильмы и находите совпадения.
					</p>
				</div>

				<div className={styles.buttonGroup}>
					<Link
						href='/create-room'
						className={`${styles.btn} ${styles.btnPrimary}`}
					>
						Создать комнату
						<span className={styles.glow} />
					</Link>

					<Link
						href='/join-room'
						className={`${styles.btn} ${styles.btnSecondary}`}
					>
						Присоединиться к комнате
					</Link>
				</div>
			</div>
		</main>
	)
}
export default Home
