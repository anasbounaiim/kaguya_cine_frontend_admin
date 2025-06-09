import { z } from 'zod'

export const ResetPasswordTokenFormSchema = z.object({
  token: z.string().min(30, { message: 'Token is required' }).max(50),
  newPassword: z.string().min(6, { message: 'Password must contain at least 6 characters' }).max(50),
})