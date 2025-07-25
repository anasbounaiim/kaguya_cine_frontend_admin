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
// import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import api from "@/utils/apiFetch"
import { ResetPasswordFormSchema } from "@/validators/resetPassword"
import { useState } from "react"
import { Mail } from "lucide-react"


export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // const router = useRouter();

  const formSendToken = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const [status, setStatus] = useState<string>("default")

  async function sendToken(values: z.infer<typeof ResetPasswordFormSchema>) {
    try {
      const response = await api.post('/api/auth/reset-password/request', values)

      console.log("response reset password :", response.data)
      toast.success("Check your email ",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
      setStatus("check")
      // router.push("/login")
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
            <Form {...formSendToken}>
              <form onSubmit={formSendToken.handleSubmit(sendToken)}className="p-6 md:p-8">
                
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col items-center text-center border-0 border-b border-white/30 pb-5">
                      <h1 className="text-2xl font-bold">Forgot password</h1>
                      <p className="text-sm text-white/80 mt-2">
                        Enter your email address bellow, and we will send you a token to reset your password.
                      </p>
                    </div>

                    <div className="flex justify-between gap-8">
                      <FormField
                        control={formSendToken.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="m@example.com" {...field} className="bg-white text-black" />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <Button type="submit" className=" bg-red-700 hover:bg-red-800 cursor-pointer font-extrabold w-fit px-16">
                        Send
                      </Button>
                    </div>

                  </div>

                
              </form>
            </Form>
          )}

          {status === "check" && (
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col items-center text-center pb-5">
                  <div className="bg-red-50 p-4 rounded-full mb-4">
                    <Mail className="h-12 w-12 text-red-700" />
                  </div>
                  <h1 className="text-2xl font-bold">Check your email</h1>
                  <p className="text-sm text-white/80 mt-2">
                    we sent you an email with a token to reset your password.
                  </p>
                </div>
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
