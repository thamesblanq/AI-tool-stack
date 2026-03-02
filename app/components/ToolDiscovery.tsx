"use client"

import { useState, useTransition, useEffect } from "react" // <-- Added useEffect
import { useRouter } from "next/navigation" 
import { aiTools } from "../lib/data"
import { ToolCard } from "./ToolCard"
import SearchBar from "./SearchBar"
import CategoryFilter from "./CategoryFilter"
import { toggleSaveTool } from "@/app/actions/saved-tools"

interface ToolDiscoveryProps {
  initialSavedIds: string[]
}

export default function ToolDiscovery({ initialSavedIds }: ToolDiscoveryProps) {
  const router = useRouter() 
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds || [])
  const [, startTransition] = useTransition()

  // --- NEW: State for "Load More" pagination ---
  const [visibleCount, setVisibleCount] = useState(9) // Start with 9 tools


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

  // --- Stats for the counter ---
  const totalTools = aiTools.length
  const filteredCount = filteredTools.length

  // --- NEW: Slice the array down to the visible count ---
  const displayedTools = filteredTools.slice(0, visibleCount)

  // --- LOGIC: Category Toggle ---
  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
    setVisibleCount(9) // Reset visible count when changing filters
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
        <SearchBar value={searchQuery} onChange={(val) => {
          setSearchQuery(val);
          setVisibleCount(9) // Reset visible count when changing search
        }} />
        <CategoryFilter 
          selectedCategories={selectedCategories} 
          toggleCategory={toggleCategory} 
        />
      </div>

      {/* Result Counter & Clear Action */}
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
              setVisibleCount(9); // Reset visible count when clearing filters
            }}
            className="text-sm font-bold text-[#00d9ff] hover:text-[#00d9ff]/80 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* WE USE displayedTools HERE INSTEAD OF filteredTools */}
        {displayedTools.length > 0 ? (
          displayedTools.map((tool) => (
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
               onClick={() => { 
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setVisibleCount(9);
                }}
               className="mt-4 text-[#00d9ff] hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      {/* --- NEW: The Load More Button --- */}
      {visibleCount < filteredCount && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="flex items-center gap-2 px-8 py-3 bg-[#14141f] border border-[#2a2a3a] text-white font-medium rounded-xl hover:border-[#00d9ff] hover:text-[#00d9ff] transition-all duration-300 shadow-xl group"
          >
            Load More Tools
            <svg 
              className="w-4 h-4 text-[#94949f] group-hover:text-[#00d9ff] group-hover:translate-y-1 transition-all duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}
      
    </section>
  )
}