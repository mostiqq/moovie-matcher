import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomsService } from './rooms.service'

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomsGateway {
	@WebSocketServer()
	server: Server

	constructor(private readonly roomsService: RoomsService) {}

	@SubscribeMessage('createRoom')
	async handleCreateRoom(
		@MessageBody() data: { name: string },
		@ConnectedSocket() client: Socket
	) {
		if (typeof data === 'string') {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				data = JSON.parse(data)
			} catch (e) {
				console.error('Could not parse JSON', e)
			}
		}
		if (!data.name) {
			console.error('ОШИБКА: Имя не передано!')
			return
		}

		const room = await this.roomsService.createRoom()
		const user = await this.roomsService.addUserToRoom(
			room.code,
			data.name,
			client.id
		)

		client.join(room.code)

		return {
			event: 'roomCreated',
			data: JSON.stringify({ roomCode: room.code, userId: user.id })
		}
	}

	@SubscribeMessage('joinRoom')
	async handleJoinRoom(
		@MessageBody() data: { name: string; roomCode: string },
		@ConnectedSocket() client: Socket
	) {
		console.log('Попытка входа:', data)

		if (typeof data === 'string') {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				data = JSON.parse(data)
			} catch (e) {
				console.error('Could not parse JSON', e)
			}
		}

		if (!data.roomCode || !data.name) {
			console.error('Нет кода комнаты или имени')
			return
		}

		// 1. Добавляем юзера в базу
		const user = await this.roomsService.addUserToRoom(
			data.roomCode,
			data.name,
			client.id
		)

		// 2. Подключаем сокет к комнате (Socket.io room)
		client.join(data.roomCode)

		// 3. Уведомляем ВСЕХ в комнате (включая создателя), что пришел новенький
		this.server.to(data.roomCode).emit('playerJoined', {
			message: `Зритель ${data.name} вошел в комнату!`,
			userName: data.name
		})

		// 4. Лично этому юзеру подтверждаем успех
		client.emit(
			'joinedSuccess',
			JSON.stringify({ userId: user.id, roomCode: data.roomCode })
		)
	}

	@SubscribeMessage('startGame')
	async handleStartGame(
		@MessageBody() data: { roomCode: string },
		@ConnectedSocket() client: Socket
	) {
		if (typeof data === 'string') {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				data = JSON.parse(data)
			} catch {
				return
			}
		}

		if (!data.roomCode) {
			console.error('Нет кода комнаты')
			return
		}

		try {
			const movieList = await this.roomsService.startGame(data.roomCode)

			this.server.to(data.roomCode).emit('gameStarted', {
				movies: movieList
			})
		} catch {
			client.emit('error', { message: 'Ошибка' })
		}
	}

	@SubscribeMessage('likeMovie')
	async handleLike(
		@MessageBody()
		data: {
			roomCode: string
			movieId: number
			movieTitle: string
			moviePoster: string
		},
		@ConnectedSocket() client: Socket
	) {
		if (typeof data === 'string') {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				data = JSON.parse(data)
			} catch {
				return
			}
		}

		if (
			!data.roomCode ||
			!data.movieId ||
			!data.movieTitle ||
			!data.moviePoster
		) {
			console.error('Неполные данные для лайка')
			return
		}

		try {
			const isMatch = await this.roomsService.registerLike(
				data.roomCode,
				client.id,
				data.movieId,
				data.movieTitle
			)

			if (isMatch) {
				this.server.to(data.roomCode).emit('matchFound', {
					movieId: data.movieId,
					movieTitle: data.movieTitle,
					moviePoster: data.moviePoster,
					message: "It's a match! 💖"
				})
			}
		} catch {
			console.error('Ошибка при лайке')
		}
	}
}
