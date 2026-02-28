"use server"

import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { prisma } from '@/app/lib/prisma' 
import { redirect } from 'next/navigation'
import { z } from 'zod'
 
export async function signup(state: FormState | undefined, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors, 
    }
  }

  // Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  } catch {
    // If the email already exists, this triggers and stops the function
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  redirect('/login')
}