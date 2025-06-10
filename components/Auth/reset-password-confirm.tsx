"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import api from "@/utils/apiFetch"
import { useState } from "react"
import { Check, Mail } from "lucide-react"
import { ResetPasswordTokenFormSchema } from "@/validators/resetPasswordToken"
import Link from "next/link"
import { useSearchParams } from "next/navigation"


export function ResetPasswordConfirmForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [status, setStatus] = useState<string>("default")
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const formResetPassword = useForm<z.infer<typeof ResetPasswordTokenFormSchema>>({
    resolver: zodResolver(ResetPasswordTokenFormSchema),
    defaultValues: {
      newPassword: ""
    },
  })

  async function resetPassword(values: z.infer<typeof ResetPasswordTokenFormSchema>) {
    try {
      const response = await api.post('/api/auth/reset-password/confirm', 
        {
          ...values,
          token: token
        }
      )

      console.log("Password has been successfully reset!:", response.data)
      toast.success("Password has been successfully reset! ",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
      setStatus("success")
    } catch {
      toast.error("Error",{
        duration: 5000,
        style: {
          border: '1px solid #f87171',
          background: '#fee2e2',
          color: '#b91c1c',
        }
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-4xl py-0 bg-black/70 text-white border border-b-4 border-red-700 w-fit mx-auto">
        <CardContent className="">
          
          { status === "default" && (
            <Form {...formResetPassword}>
                <form onSubmit={formResetPassword.handleSubmit(resetPassword)} className="p-6 md:p-8">
                    <div className="flex flex-col gap-10">
                      <div className="flex flex-col items-center text-center border-0 border-b border-white/30 pb-5">
                        <div className="bg-red-50 p-4 rounded-full mb-4">
                          <Mail className="h-12 w-12 text-red-700" />
                        </div>
                        <h1 className="text-2xl font-bold">Create a new password</h1>
                        <p className="text-sm text-white/80 mt-2">
                          Enter your new password below to complete the reset process.
                        </p>
                      </div>

                      <FormField
                        control={formResetPassword.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input placeholder="***************" {...field} className="bg-white text-black" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col justify-center items-center">
                        <Button type="submit" className=" bg-red-700 hover:bg-red-800 cursor-pointer font-extrabold w-fit px-16">
                          Reset Password
                        </Button>
                      </div>

                    </div>
                </form>
            </Form>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center p-6 md:p-8">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <Check className="h-12 w-12 text-green-700" />
              </div>
              <h1 className="text-2xl font-bold">Success!</h1>
              <p className="text-sm text-white/80 mt-2">
                Your password has been successfully reset. You can now login with your new password.
              </p>

              <div className="flex flex-col justify-center items-center mt-6">
                <Link href="/login" className=" bg-red-700 hover:bg-red-800 cursor-pointer font-extrabold w-fit rounded-md py-2 px-10">
                  Login
                </Link>
              </div>
            </div>
            
          )}


        </CardContent>
      </Card>
      <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        &copy; 2025 <b>KaguyaCine Lab</b>. All rights reserved.
      </div>
    </div>
  )
}
