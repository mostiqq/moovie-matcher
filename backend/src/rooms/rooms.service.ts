import { HttpService } from '@nestjs/axios'
import { Injectable, NotFoundException } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { KinopoiskResponse } from './types/kinopoisk.types'

@Injectable()
export class RoomsService {
	constructor(
		private prisma: PrismaService,
		private readonly httpService: HttpService
	) {}

	private generateRoomCode() {
		return Math.random().toString(36).substring(2, 6).toUpperCase()
	}

	async getMoviesFromKinopoisk(page: number = 1) {
		const apiKey = process.env.KINOPOISK_API_KEY
		const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top'
		try {
			const response = await lastValueFrom(
				this.httpService.get<KinopoiskResponse>(url, {
					headers: {
						'X-API-KEY': apiKey,
						'Content-Type': 'application/json'
					},
					params: {
						type: 'TOP_100_POPULAR_FILMS',
						page
					}
				})
			)

			return response.data.films.map(movie => ({
				id: movie.filmId,
				title: movie.nameRu || movie.nameEn || 'Без названия',
				poster_path: movie.posterUrlPreview,
				overview: 'Описание недоступно в списке (нужен отдельный запрос)',
				rating: movie.rating ? parseFloat(movie.rating) : 0
			}))
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			console.log('Ошибка кинопоиск апи', e.message)
			return this.mockMovies
		}
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

	private readonly mockMovies = [
		{
			id: 550,
			title: 'Fight Club',
			poster_path: '/pB8BM7pdSp6B6Ih7Qf4n6a8MIxdf.jpg',
			overview: 'A ticking-time-bomb insomniac...'
		},
		{
			id: 27205,
			title: 'Inception',
			poster_path: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
			overview: 'Cobb, a skilled thief who commits corporate espionage...'
		},
		{
			id: 157336,
			title: 'Interstellar',
			poster_path: '/gEU2QniL6C971TCyJ0KDbd3zaaG.jpg',
			overview: 'The adventures of a group of explorers...'
		}
	]

	async startGame(roomCode: string) {
		await this.getRoomByCode(roomCode)
		const movies = await this.getMoviesFromKinopoisk(1)
		return movies
	}

	async registerLike(
		roomCode: string,
		socketId: string,
		movieId: number,
		movieTitle: string
	) {
		const room = await this.getRoomByCode(roomCode)

		const user = room.users.find(u => u.socketId === socketId)
		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		try {
			await this.prisma.like.create({
				data: {
					movieId,
					movieTitle,
					userId: user.id,
					roomId: room.id
				}
			})
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (e.code !== 'P2002') {
				throw e
			}
		}

		const likesCount = await this.prisma.like.count({
			where: {
				roomId: room.id,
				movieId
			}
		})

		const usersCount = room.users.length
		return likesCount >= usersCount
	}
}
