import { aiTools } from "../../../lib/data";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "../../../lib/prisma";
import ToolDetailClient from "../../../components/ToolDetailClient";

export default async function ToolPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  const tool = aiTools.find((t) => t.id === id);

  if (!tool) notFound();

  // Check Prisma if this specific tool is saved by the current user
  let isSavedInitial = false;
  if (session?.user?.id) {
    const saved = await prisma.savedTool.findUnique({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId: id,
        },
      },
    });
    isSavedInitial = !!saved;
  }

  return <ToolDetailClient tool={tool} isSavedInitial={isSavedInitial} />;
}