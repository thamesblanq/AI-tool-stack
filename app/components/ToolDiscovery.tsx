"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation" // <-- Added router import
import { aiTools } from "../lib/data"
import { ToolCard } from "./ToolCard"
import SearchBar from "./SearchBar"
import CategoryFilter from "./CategoryFilter"
import { toggleSaveTool } from "@/app/actions/saved-tools"

interface ToolDiscoveryProps {
  initialSavedIds: string[]
}

export default function ToolDiscovery({ initialSavedIds }: ToolDiscoveryProps) {
  const router = useRouter() // <-- Initialized router
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds || [])
  const [, startTransition] = useTransition()

  // --- LOGIC: Filtering ---
  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      tool.category.some(cat => selectedCategories.includes(cat))
    
    return matchesSearch && matchesCategory
  })

  // --- NEW: Stats for the counter ---
  const totalTools = aiTools.length
  const filteredCount = filteredTools.length

  // --- LOGIC: Category Toggle ---
  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  // --- LOGIC: Prisma Save Toggle (Optimistic with Auth check) ---
  const handleToggleSave = (toolId: string) => {
    const isCurrentlySaved = savedIds.includes(toolId)
    
    // 1. Optimistic Update
    setSavedIds(prev => 
      isCurrentlySaved ? prev.filter(id => id !== toolId) : [...prev, toolId]
    )

    startTransition(async () => {
      try {
        const result = await toggleSaveTool(toolId)

        // 2. Check for the structured error we set up in the server action
        if (result && !result.success) {
          // Rollback the UI
          setSavedIds(prev => 
            isCurrentlySaved ? [...prev, toolId] : prev.filter(id => id !== toolId)
          )
          
          // 3. Trigger redirect if not logged in
          if (result.message === "Unauthorized") {
            alert("You need to be logged in to save tools!")
            router.push("/login")
          } else {
            console.error("Failed to save tool:", result.message)
          }
        }
      } catch (error) {
        // Fallback catch for network errors
        setSavedIds(prev => 
          isCurrentlySaved ? [...prev, toolId] : prev.filter(id => id !== toolId)
        )
        console.error("Failed to save tool:", error)
      }
    })
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col items-center mb-12">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter 
          selectedCategories={selectedCategories} 
          toggleCategory={toggleCategory} 
        />
      </div>

      {/* --- NEW: Result Counter & Clear Action --- */}
      <div className="flex items-center justify-between mb-8 px-2 border-b border-[#2a2a3a] pb-4">
        <div className="flex items-center gap-3">
          <p className="text-lg text-white">
            Showing {filteredCount} {filteredCount === 1 ? 'tool' : 'tools'}
          </p>
          {filteredCount !== totalTools && (
            <span className="text-sm text-[#94949f] bg-[#1e1e2e] px-2 py-0.5 rounded-md border border-[#2a2a3a]">
              from {totalTools} total
            </span>
          )}
        </div>

        {(searchQuery || selectedCategories.length > 0) && (
          <button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategories([]);
            }}
            className="text-sm font-bold text-[#00d9ff] hover:text-[#00d9ff]/80 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              isSaved={savedIds.includes(tool.id)}
              onToggleSave={handleToggleSave}
              selectedCategories={selectedCategories} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-[#14141f] rounded-3xl border border-dashed border-[#2a2a3a]">
            <p className="text-[#94949f] text-lg">No tools found matching your search.</p>
            <button 
               onClick={() => {setSearchQuery(""); setSelectedCategories([])}}
               className="mt-4 text-[#00d9ff] hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </div>
    </section>
  )
}