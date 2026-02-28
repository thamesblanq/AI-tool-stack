import ToolDiscovery from "../components/ToolDiscovery"
import { auth } from "@/auth"
import { prisma } from "../lib/prisma"

export default async function HomePage() {
  const session = await auth()
  
  // 1. Fetch saved tool IDs if user is logged in
  let savedToolsId: string[] = []
  
  if (session?.user?.id) {
    const saved = await prisma.savedTool.findMany({
      where: { userId: session.user.id },
      select: { toolId: true }
    })
    savedToolsId = saved.map(s => s.toolId)
  }

  return (
    <main className="bg-[#0a0a0f] min-h-screen text-white p-8 flex flex-col items-center">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#94949f] bg-clip-text text-transparent">
          Discover AI Tools
        </h1>
        <p className="text-[#94949f] text-lg">
          Find the perfect AI tools to optimize your workflow
        </p>
      </div>

      {/* Pass the fetched IDs (now defined!) to ToolDiscovery */}
      <ToolDiscovery initialSavedIds={savedToolsId} />
    </main>
  )
}