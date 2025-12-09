import Providers from '@/components/providers/Providers'
import type { Metadata } from 'next'
import { Ubuntu } from 'next/font/google'
import './globals.scss'

const ubuntu = Ubuntu({
	subsets: ['cyrillic', 'latin'],
	weight: ['300', '400', '500', '700']
})

export const metadata: Metadata = {
	title: 'Movie matcher',
	description: 'You can match movie with your friend'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={ubuntu.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
