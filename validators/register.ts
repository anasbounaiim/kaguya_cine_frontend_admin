import { z } from 'zod'

export const RegisterFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }).max(50),
  lastName: z.string().min(1, { message: 'Last name is required' }).max(50),
  email: z.string().email({ message: 'Please enter a valid e-mail address.' }).max(30),
  password: z.string().min(6, { message: 'Password must contain at least 6 characters' }).max(50),
})