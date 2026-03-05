"use client"
import Link from "next/link"
import { useActionState, useState } from "react"
import { signup } from "../actions/signup"

const SignupForm = () => {
  const [state, action, pending] = useActionState(signup, undefined)
  const [pwd, setPwd] = useState("")
  
  // NEW: State for password visibility
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

  return (
    <div className="bg-[#14141f] border border-[#2a2a3a] rounded-2xl p-8 mb-8">
        <form action={action} className="space-y-6">

            <div className="space-y-2">
                <label htmlFor="name" className="font-medium">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#1e1e2e] border border-[#2a2a3a] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
                />
            </div>
            {state?.errors?.name && <p className="text-red-500">{state.errors.name}</p>}
            
            <div className="space-y-2">
                <label htmlFor="email" className="font-medium">Email</label>
                <input 
                  id="email"
                  type="email" 
                  name="email"
                  placeholder="youremail@example.com"
                  required
                  className="w-full bg-[#1e1e2e] border border-[#2a2a3a] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
                />
            </div>
            {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}

            <div className="space-y-2">
                <label htmlFor="password" className="font-medium flex justify-between">
                    Password
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
                    
                    {/* NEW: The toggle button with SVG icons */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94949f] hover:text-[#043942] transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            // Eye Off Icon
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            // Eye Icon
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {(isPwdFocused || pwd.length > 0) && (
                <p className={`text-sm ${isPasswordStrong ? 'text-green-500' : 'text-[#94949f]'}`}>
                    {getDynamicFeedback()}
                </p>
            )}

            {/* Server-side errors */}
            {state?.errors?.password && (
                <div className="text-red-500 text-sm">
                  <p>Password must:</p>
                  <ul className="list-disc pl-5">
                      {state.errors.password.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                  </ul>
                </div>
            )}

            <button 
              type="submit"
              disabled={pending} 
              className="w-full bg-[#00d9ff] text-[#0a0a0f] font-medium py-3 rounded-lg hover:bg-[#00b8d4]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {pending ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center mt-6">
                <p className="text-sm text-[#94949f]">Already have an account? <Link href="/login" className="text-[#00d9ff] hover:underline">Sign in</Link></p>
            </div>

        </form>
    </div>
  )
}

export default SignupForm