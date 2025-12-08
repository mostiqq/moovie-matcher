import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class RoomsService {
	constructor(private prisma: PrismaService) {}

	private generateRoomCode() {
		return Math.random().toString(36).substring(2, 6).toUpperCase()
	}

	async createRoom() {
		const code = this.generateRoomCode()
		return this.prisma.room.create({
			data: {
				code
			}
		})
	}

	async getRoomByCode(code: string) {
		const room = await this.prisma.room.findUnique({
			where: {
				code
			},
			include: {
				users: true
			}
		})

		if (!room) {
			throw new NotFoundException('Комната не найдена')
		}

		return room
	}

	async addUserToRoom(code: string, name: string, socketId: string) {
		const room = await this.getRoomByCode(code)
		console.log(`Creating user: ${name} in room ${code}`)
		return this.prisma.user.create({
			data: {
				name,
				socketId,
				roomId: room.id
			}
		})
	}
}
