"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AITool } from "@/app/lib/data";
import { ToolCard } from "./ToolCard";
import { BookmarkCheck, Trash2 } from "lucide-react"; // <-- Added Trash2 icon
import { toggleSaveTool, removeAllSavedTools } from "@/app/actions/saved-tools"; // <-- Imported new action

interface BookmarksClientProps {
  initialSavedTools: AITool[];
  initialSavedIds: string[];
}

export default function BookmarksClient({ initialSavedTools, initialSavedIds }: BookmarksClientProps) {
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);
  const [isPending, startTransition] = useTransition();

  // Optimistic Unsave Logic (Single Tool)
  const handleToggleSave = (toolId: string) => {
    const isCurrentlySaved = savedIds.includes(toolId);
    setSavedIds(prev => prev.filter(id => id !== toolId));

    startTransition(async () => {
      try {
        const result = await toggleSaveTool(toolId);
        if (result && !result.success) {
          setSavedIds(prev => isCurrentlySaved ? [...prev, toolId] : prev);
          if (result.message === "Unauthorized") {
            alert("Session expired. Please log in again.");
            router.push("/login");
          }
        }
      } catch {
        setSavedIds(prev => isCurrentlySaved ? [...prev, toolId] : prev);
      }
    });
  };

  // --- NEW: Clear All Logic ---
  const handleClearAll = () => {
    // 1. Safety check
    if (!window.confirm("Are you sure you want to remove all saved tools? This cannot be undone.")) return;

    // 2. Optimistic Update: instantly clear the grid
    const previousIds = [...savedIds];
    setSavedIds([]);

    // 3. Fire server action
    startTransition(async () => {
      try {
        const result = await removeAllSavedTools();
        if (result && !result.success) {
          // Rollback if it fails
          setSavedIds(previousIds);
          if (result.message === "Unauthorized") {
            alert("Session expired. Please log in again.");
            router.push("/login");
          }
        }
      } catch {
        setSavedIds(previousIds);
      }
    });
  };

  // Only display tools that are CURRENTLY in the savedIds state
  const displayedTools = initialSavedTools.filter(tool => savedIds.includes(tool.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-12 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <div className="p-3 bg-[#00d9ff]/10 rounded-2xl border border-[#00d9ff]/20">
            <BookmarkCheck className="w-8 h-8 text-[#00d9ff]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">My Saved Tools</h1>
        </div>
        <p className="text-[#94949f] text-lg">Quick access to your favorite AI tools</p>
      </div>

      {displayedTools.length > 0 ? (
        <>
          {/* --- NEW: Header with Clear Button --- */}
          <div className="flex items-center justify-between mb-6 border-b border-[#2a2a3a] pb-4">
            <div className="text-sm font-medium text-[#5a5a6a] uppercase tracking-widest">
              {displayedTools.length} {displayedTools.length === 1 ? 'tool' : 'tools'} in your collection
            </div>
            
            <button 
              onClick={handleClearAll}
              disabled={isPending}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isPending ? "Clearing..." : "Clear Collection"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isSaved={true} 
                onToggleSave={handleToggleSave}
                selectedCategories={[]} 
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-24">
          <div className="bg-[#14141f] border border-[#2a2a3a] shadow-2xl rounded-3xl p-12 max-w-lg mx-auto flex flex-col items-center">
            <div className="p-6 bg-[#1e1e2e] rounded-full border border-[#2a2a3a] mb-6">
              <BookmarkCheck className="w-12 h-12 text-[#5a5a6a]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No tools saved yet</h2>
            <p className="text-[#94949f] mb-8 text-lg">
              Start exploring the directory and bookmark your favorite AI tools for quick access here.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-[#00d9ff] text-[#0a0a0f] font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,217,255,0.3)]"
            >
              Discover Tools
            </button>
          </div>
        </div>
      )}
    </div>
  );
}