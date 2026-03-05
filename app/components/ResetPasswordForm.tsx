"use client"
import Link from "next/link"
import { useActionState, useState } from "react"
import { resetPassword } from "../actions/reset-password" 

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined)
  
  const [pwd, setPwd] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPwdFocused, setIsPwdFocused] = useState(false)
  
  const hasAlphabet = /[a-zA-Z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  const isValidLength = pwd.length >= 8
  const isPasswordStrong = hasAlphabet && hasNumber && hasSpecialChar && isValidLength

  const getPasswordStateClasses = () => {
    if (pwd.length === 0) return 'border-[#2a2a3a] focus:ring-[#00d9ff]' 
    if (isPasswordStrong) return 'border-green-500 focus:ring-green-500' 
    return 'border-red-500 focus:ring-red-500' 
  }

  const getDynamicFeedback = () => {
    if (pwd.length === 0) return "Password must contain at least 8 characters, a letter, a number, and a special character.";
    if (isPasswordStrong) return "Password is strong.";
    const missing = [];
    if (!isValidLength) missing.push("at least 8 characters");
    if (!hasAlphabet) missing.push("a letter");
    if (!hasNumber) missing.push("a number");
    if (!hasSpecialChar) missing.push("a special character");
    return `Still needs: ${missing.join(", ")}.`;
  }

  if (state?.success) {
    return (
        <div className="text-center space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg text-sm">
                {state.message}
            </div>
            <Link href="/login" className="block w-full bg-[#00d9ff] text-[#0a0a0f] font-medium py-3 rounded-lg hover:bg-[#00b8d4]/90 transition-colors">
                Go to Login
            </Link>
        </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
            <label htmlFor="password" className="font-medium text-white flex justify-between">
                New Password
            </label>
            <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"}  
                  name="password"
                  placeholder="********"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onFocus={() => setIsPwdFocused(true)}
                  onBlur={() => setIsPwdFocused(false)}
                  required
                  className={`w-full bg-[#1e1e2e] border rounded-lg p-3 pr-12 text-white focus:outline-none focus:ring-2 transition-colors ${getPasswordStateClasses()}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94949f] hover:text-white transition-colors cursor-pointer"
                >
                    {showPassword ? "Hide" : "Show"} 
                </button>
            </div>
        </div>

        {(isPwdFocused || pwd.length > 0) && (
            <p className={`text-sm ${isPasswordStrong ? 'text-green-500' : 'text-[#94949f]'}`}>
                {getDynamicFeedback()}
            </p>
        )}

        {state?.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm text-center">
                {state.error}
            </div>
        )}

        <button 
            type="submit"
            disabled={pending || !isPasswordStrong} 
            className="w-full bg-[#00d9ff] text-[#0a0a0f] font-medium py-3 rounded-lg hover:bg-[#00b8d4]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            {pending ? 'Saving...' : 'Reset Password'}
        </button>
    </form>
  )
}