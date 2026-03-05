"use server"

import crypto from "crypto"
import { prisma } from "../lib/prisma" 
//import { Resend } from "resend" // 1. Import Resend

// 2. Initialize Resend using your environment variable
//const resend = new Resend(process.env.RESEND_API_KEY)

export async function forgotPassword(
  prevState: { error?: string; success?: boolean; message?: string } | undefined, 
  formData: FormData
) {
  const email = formData.get("email")

  // 1. Basic validation
  if (!email || typeof email !== "string") {
    return { error: "Please provide a valid email address." }
  }

  try {
    // 2. Look up the user using Prisma
    const user = await prisma.user.findUnique({ 
      where: { email } 
    })
    
    // SECURITY NOTE: Don't leak whether the email exists or not
    if (!user) {
      return { success: true, message: "If an account exists, a reset link has been sent." }
    }

    // 3. Generate a secure random token to send to the user
    const resetToken = crypto.randomBytes(32).toString("hex")
    
    // 4. Hash the token before saving it to the database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    
    // 5. Set an expiration time (1 hour from now)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) 

    // 6. Save the hashed token and expiry date via Prisma
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpiry,
      }
    })

    // 7. Create the reset URL
    const appUrl = process.env.APP_URL || "http://localhost:3000"
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`

    // 8. Send the email using Resend --- too broke to use resend for real, so we'll just return the link in the response for demo purposes!
/*     await resend.emails.send({
      from: "onboarding@resend.dev", // Keep this as-is until you add a custom domain to Resend
      to: email, // Must match your Resend account email during testing
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You recently requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #00d9ff; color: #0a0a0f; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">This link is valid for 1 hour. If you did not request a password reset, please ignore this email safely.</p>
        </div>
      `
    }) */

    return { 
      success: true, 
      message: "Since this is a demo environment, your reset link is provided below:",
      demoLink: resetUrl // <-- Pass the link back to the UI!
    }


  } catch (error) {
    console.error("Forgot password error:", error)
    return { error: "Something went wrong. Please try again later." }
  }
}