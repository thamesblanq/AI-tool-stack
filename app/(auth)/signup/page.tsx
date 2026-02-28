import { Sparkles } from "lucide-react"
import SignupForm from "../../components/SignUpForm"

const page = () => {
  return (
    <main className={`bg-zinc-950 min-h-screen flex items-center justify-center text-white`}>
        <div className="w-full max-w-md">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-[#00d9ff] to-[#a855f7]">
                    <Sparkles className="w-8 h-8 text-[#0a0a0f]"/>
                </div>
                <div>
                    <h1 className="text-3xl mb-2 font-semibold">Create Account</h1>
                    <p className="text-[#94949f]">Join us to discover the best AI tools.</p>
                </div>

            </div>
            <SignupForm />
        </div>
    </main>
  )
}

export default page