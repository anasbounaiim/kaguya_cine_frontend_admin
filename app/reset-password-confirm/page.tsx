import { ResetPasswordConfirmForm } from "@/components/Auth/reset-password-confirm";
import { WavyBackground } from "@/components/ui/wavy-background";


export default function ResetPassword() {
  return (
    <WavyBackground className="max-w-xl mx-auto pb-40  flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetPasswordConfirmForm />
      </div>
    </WavyBackground>
  )
}