import { z } from 'zod'

export const ResetPasswordTokenFormSchema = z.object({
  newPassword: z.string().min(6, { message: 'Password must contain at least 6 characters' }).max(50),
  confirmNewPassword: z.string().min(6, { message: 'Password must contain at least 6 characters' }).max(50)
})