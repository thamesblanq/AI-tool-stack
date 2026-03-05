import Link from "next/link"
import ResetPasswordForm from "../components/ResetPasswordForm" 

export const metadata = {
  title: "Create New Password",
}

// In Next.js App Router, page components receive searchParams as a prop
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4 text-white">
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
            <p className="text-[#94949f] mb-6">This password reset link is missing or invalid.</p>
            <Link href="/forgot-password" className="text-[#00d9ff] hover:underline">Request a new link</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
        <div className="w-full max-w-md bg-[#14141f] border border-[#2a2a3a] rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                <p className="text-[#94949f]">Please enter your new strong password below.</p>
            </div>
            
            {/* Pass the token down as a prop */}
            <ResetPasswordForm token={token} />
        </div>
    </div>
  )
}