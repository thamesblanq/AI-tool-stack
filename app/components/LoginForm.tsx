"use client"
import Link from "next/link"
import { useActionState } from "react"
import { login } from "@/app/actions/login"

interface LoginState {
  errors?: {
    email?: string[]
  }
  message?: string
}

const LoginForm = () => {
const [state, action, pending] = useActionState<LoginState | undefined, FormData>(login, undefined)

  return (
    <div className="bg-[#14141f] border border-[#2a2a3a] rounded-2xl p-8">
        <form action={action} className="space-y-6">
            
            <div className="space-y-2">
                <label htmlFor="email" className="font-medium">Email</label>
                <input 
                id="email"
                type="text" 
                name="email"
                placeholder="youremail@example.com"
                required
                className="w-full bg-[#1e1e2e] border border-[#2a2a3a] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
                />
            </div>
            {state && 'errors' in state && state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}

            <div className="space-y-2">
                <label htmlFor="password" className="font-medium">Password</label>
                <input 
                id="password"
                type="password"  
                name="password"
                placeholder="********"
                required
                className="w-full bg-[#1e1e2e] border border-[#2a2a3a] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
                />
            </div>
            {state?.message && <p className="text-red-500 text-sm font-medium text-center">{state.message}</p>}

            <button 
              type="submit" 
              disabled={pending}
              className="w-full bg-[#00d9ff] text-[#0a0a0f] font-medium py-3 rounded-lg hover:bg-[#00b8d4]/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {pending ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center mt-6">
                <p className="text-sm text-[#94949f]">Don&apos;t have an account? <Link href="/signup" className="text-[#00d9ff] hover:underline">Sign up</Link></p>
            </div>


        </form>
    </div>
  )
}

export default LoginForm