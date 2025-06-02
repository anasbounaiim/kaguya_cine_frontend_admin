"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"

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
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { RegisterFormSchema } from "@/validators/register"
import Link from "next/link"


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    try {
      const response = await axios.post('/api/auth/register', values)

      console.log("response register :", response.data)
      toast.success("Account created ",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
      router.push("/login")
    } catch {
      console.error("Account creation failed")
      toast.error("",{
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
      <Card className="overflow-hidden rounded-3xl py-0 bg-black text-white border-0 border-b-2 border-white">
        <CardContent className="">
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}className="p-6 md:p-8">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col items-center text-center border-0 border-b border-white/30 pb-5">
                  <h1 className="text-2xl font-bold">Welcome</h1>
                  <p className="text-balance text-muted-foreground">
                    Create a new KaguyaCine Lab account
                  </p>
                </div>

                <div className="flex justify-between gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Type your first name" {...field} className="bg-white text-black" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Type your last name" {...field} className="bg-white text-black" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between gap-8">
                  <FormField
                    control={form.control}
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

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="***************" {...field} className="bg-white text-black" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col justify-center items-center">
                  <Button type="submit" className=" bg-red-700 hover:bg-red-800 cursor-pointer font-extrabold w-fit px-16">
                    Register
                  </Button>
                  <Link href="/login" className="mt-4 text-sm">
                    Already have an account? <b className="underline">Login</b>
                  </Link>
                </div>

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
