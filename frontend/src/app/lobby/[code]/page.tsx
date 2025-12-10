import Room from './Room'

interface Props {
	params: Promise<{ code: string }>
}

export default async function RoomPage({ params }: Props) {
	const { code } = await params

	return <Room code={code} />
}
