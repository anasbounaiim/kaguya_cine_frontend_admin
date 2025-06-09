import { z } from 'zod'

export const ResetPasswordFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid e-mail address.' }).max(30)
})