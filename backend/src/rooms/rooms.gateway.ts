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
				data = JSON.parse(data)
			} catch (e) {
				console.error('Could not parse JSON')
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
		@MessageBody() rawData: unknown,
		@ConnectedSocket() client: Socket
	) {
		console.log('Попытка входа:', rawData)

		let data
		// Тот же парсинг, что и в createRoom
		if (typeof rawData === 'string') {
			try {
				data = JSON.parse(rawData)
			} catch (e) {
				return
			}
		} else {
			data = rawData
		}

		// Нам нужны и код комнаты, и имя
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
}
