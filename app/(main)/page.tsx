import ToolDiscovery from "../components/ToolDiscovery"
import { auth } from "@/auth"
import { prisma } from "../lib/prisma"

export default async function HomePage() {
  let savedToolsId: string[] = []

  try {
    const session = await auth()

    if (session?.user?.id) {
      const saved = await prisma.savedTool.findMany({
        where: { userId: session.user.id },
        select: { toolId: true }
      })
      savedToolsId = saved.map(s => s.toolId)
    }
  } catch (error) {
    console.error("HomePage: error during data fetch:", error)
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

      <ToolDiscovery initialSavedIds={savedToolsId} />
    </main>
  )
}
