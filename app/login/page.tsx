import { LoginForm } from "@/components/Auth/login-form";
import { WavyBackground } from "@/components/ui/wavy-background";


export default function LoginPage() {
  return (
    // <div className="bg-gradient-to-br from-red-700 from-10% via-red-900 via-30% to-red-950 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <WavyBackground className="max-w-4xl mx-auto pb-40  flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </WavyBackground>
    // </div>
  )
}

