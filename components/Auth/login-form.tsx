"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { LoginFormSchema } from "@/validators/login"
import api from "@/utils/apiFetch"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      // Appel à l'API route Next.js (qui pose le cookie HttpOnly)
      await api.post('/api/auth/login', values);

      toast.success("Login successful!",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
      router.push("/")
    } catch (err: unknown) {
      console.error("Login error", err)
      toast.error("Login failed",{
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
        <CardContent>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col items-center text-center mb-4">
                  <Image
                    src="/KaguyaCine logo svg.svg"
                    alt="KaguyaCine Logo"
                    width={40}
                    height={40}
                    className="h-12 w-12 rounded-lg bg-red-700"
                  />
                  <h1 className="text-2xl font-bold mt-3">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your KaguyaCine Lab account
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} className="bg-white text-black" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex justify-between items-center w-full">
                          <span>
                            Password
                          </span>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="***************" type="password" {...field} className="bg-white text-black" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 cursor-pointer font-extrabold">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        &copy; 2025 <b>KaguyaCine Lab</b>. All rights reserved.
      </div>
    </div>
  )
}
