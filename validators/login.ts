import { z } from 'zod'

export const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid e-mail address.' }).max(30),
  password: z.string().min(6, { message: 'Password must contain at least 6 characters' }).max(50)
})