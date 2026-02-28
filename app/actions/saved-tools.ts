"use server"

import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleSaveTool(toolId: string) {
  try {
    const session = await auth();

    // Return a structured error instead of throwing a raw Error
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    const existing = await prisma.savedTool.findUnique({
      where: { userId_toolId: { userId, toolId } }
    });

    if (existing) {
      await prisma.savedTool.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.savedTool.create({
        data: { userId, toolId }
      });
    }

    revalidatePath("/"); 
    return { success: true };
    
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function removeAllSavedTools() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Wipe all saved tools for this specific user
    await prisma.savedTool.deleteMany({
      where: { userId }
    });

    revalidatePath("/bookmarks"); 
    revalidatePath("/"); // Refreshes home page bookmarks too
    return { success: true };
    
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}