import { RegisterForm } from "@/components/Auth/register-form";
import { WavyBackground } from "@/components/ui/wavy-background";


export default function Rgister() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40  flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </WavyBackground>
  )
}