"use client"
import Link from "next/link"
import { useActionState } from "react"
import { forgotPassword } from "../actions/forgot-password" 

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  const typedState = state as { success?: boolean; message?: string; error?: string; demoLink?: string } | undefined

  return (
    <form action={action} className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="email" className="font-medium text-white">Email</label>
            <input 
                id="email"
                type="email" 
                name="email"
                placeholder="youremail@example.com"
                required
                className="w-full bg-[#1e1e2e] border border-[#2a2a3a] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d9ff] transition-colors"
            />
        </div>

{typedState?.success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg text-sm text-center flex flex-col gap-3">
                <p>{typedState.message}</p>
                {/* Check if the demoLink came back from the server */}
                {typedState.demoLink && (
                    <a 
                      href={typedState.demoLink} 
                      className="inline-block bg-[#00d9ff] text-[#0a0a0f] font-bold py-2 px-4 rounded-md hover:bg-[#00b8d4] transition-colors"
                    >
                      Click here to reset password
                    </a>
                )}
            </div>
        )}

        {typedState?.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm text-center">
                {typedState.error}
            </div>
        )}

        <button 
            type="submit"
            disabled={pending} 
            className="w-full bg-[#00d9ff] text-[#0a0a0f] font-medium py-3 rounded-lg hover:bg-[#00b8d4]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            {pending ? 'Sending Link...' : 'Send Reset Link'}
        </button>

        <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-[#94949f] hover:text-white transition-colors">
                &larr; Back to login
            </Link>
        </div>
    </form>
  )
}