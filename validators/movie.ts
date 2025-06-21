import { z } from 'zod'

export const MovieFormSchema = z.object({

    movieId: z.string().uuid({ message: 'Invalid movie ID format.' }).optional(),
    title: z.string().min(1, { message: 'Title is required.' }).max(100, { message: 'Title must be at most 100 characters long.' }),
    originalTitle: z.string().min(1, { message: 'Original title is required.' }).max(100, { message: 'Original title must be at most 100 characters long.' }),
    releaseDate: z.string().refine(date => !isNaN(Date.parse(date)), {
                    message: 'Invalid release date format. Use YYYY-MM-DD.' 
                }),
    durationMin: z.string().min(1, { message: 'Duration is required.' }).max(3, { message: 'Duration must be at most 3 numbers long.'}),
    synopsis: z.string().min(1, { message: 'Synopsis is required.' }).max(500, { message: 'Synopsis must be at most 500 characters long.' }),
    posterUrl: z.string().url({ message: 'Poster URL must be a valid URL.' }),
    trailerUrl: z.string().url({ message: 'Trailer URL must be a valid URL.' }),
    ageRating: z.string().min(1, { message: 'Age rating is required.' }).max(10, { message: 'Age rating must be at most 10 characters long.' }),
    genres: z.array(z.string().min(1, { message: 'Genre is required.' })).min(1, { message: 'At least one genre is required.' }),
    versions: z.array(z.object({
        language: z.string().min(1, { message: 'Language is required.' }),
        format: z.string().min(1, { message: 'Format is required.' })
    })).min(1, { message: 'At least one version is required.' }),
    private: z.boolean().optional()
})