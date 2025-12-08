export interface KinopoiskFilm {
	filmId: number
	nameRu: string
	nameEn: string | null
	year: string
	filmLength: string
	countries: { country: string }[]
	genres: { genre: string }[]
	rating: string // Часто приходит строкой "8.8" или "99%"
	ratingVoteCount: number
	posterUrl: string
	posterUrlPreview: string
}

export interface KinopoiskResponse {
	pagesCount: number
	films: KinopoiskFilm[]
}
