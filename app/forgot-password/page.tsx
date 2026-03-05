import ForgotPasswordForm from "../components/ForgotPasswordPage" // Or wherever you keep your components

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
        <div className="w-full max-w-md bg-[#14141f] border border-[#2a2a3a] rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-[#94949f]">Enter your email and we&apos;ll send you a reset link.</p>
            </div>
            
            {/* The interactive client component */}
            <ForgotPasswordForm />
        </div>
    </div>
  )
}