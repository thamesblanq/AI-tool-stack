"use server"

import crypto from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"

export async function resetPassword(prevState: { error?: string; success?: boolean; message?: string } | undefined, formData: FormData) {
  const token = formData.get("token")
  const newPassword = formData.get("password")

  if (!token || typeof token !== "string" || !newPassword || typeof newPassword !== "string") {
    return { error: "Invalid request. Please try again." }
  }

  try {
    // 1. Hash the incoming token so we can compare it to the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // 2. Find the user with this token, ensuring it hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(), // "gt" means Greater Than now (so it hasn't expired)
        },
      },
    })

    // 3. If no user is found, the token is fake or expired
    if (!user) {
      return { error: "This password reset link is invalid or has expired." }
    }

    // 4. Hash the new password securely
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 5. Update the user's password and CLEAR the reset tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    return { 
      success: true, 
      message: "Password successfully reset! You can now log in." 
    }

  } catch (error) {
    console.error("Reset password error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}