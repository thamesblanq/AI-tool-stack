import { auth } from "@/auth";
import { prisma } from "../../lib/prisma"; // Make sure this path is correct for your setup
import { aiTools } from "@/app/lib/data"; // <--- ADDED aiTools HERE
import { redirect } from "next/navigation";
import BookmarksClient from "../../components/BookmarksClient";

export default async function BookmarksPage() {
  const session = await auth();
  
  // Double-check auth (even though middleware protects it, this satisfies TypeScript)
  if (!session?.user?.id) {
    redirect('/login');
  }

  // 1. Fetch saved tool IDs from Prisma
  const saved = await prisma.savedTool.findMany({
    where: { userId: session.user.id },
    select: { toolId: true },
    orderBy: { createdAt: 'desc' } // Shows newest saves first
  });

  const savedIds = saved.map(s => s.toolId);

  // 2. Filter your static data to find the full tool objects
  const savedToolsData = aiTools.filter(tool => savedIds.includes(tool.id));

  // 3. Pass data to the Client Component
  return <BookmarksClient initialSavedTools={savedToolsData} initialSavedIds={savedIds} />;
}