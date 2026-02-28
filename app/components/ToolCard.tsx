// components/ToolCard.tsx
"use client"

import Link from 'next/link';
import { AITool } from '../lib/data';
import { Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ToolCardProps {
  tool: AITool;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
  selectedCategories: string[];
}

export function ToolCard({ tool, isSaved, onToggleSave }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/tool/${tool.id}`} prefetch={true}>
        <div className="bg-[#14141f] border border-[#2a2a3a] rounded-2xl p-6 hover:border-[#00d9ff]/50 transition-all duration-300 group cursor-pointer h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="text-5xl">{tool.logo}</div>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevents clicking the bookmark from navigating to detail page
                onToggleSave(tool.id);
              }}
              className="p-2 hover:bg-[#1e1e2e] rounded-lg transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-[#00d9ff]" />
              ) : (
                <Bookmark className="w-5 h-5 text-[#94949f]" />
              )}
            </button>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-[#00d9ff] transition-colors text-white">{tool.name}</h3>
          <p className="text-sm text-[#94949f] mb-4 line-clamp-2">{tool.tagline}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tool.category.map((cat) => (
              <span key={cat} className="text-[10px] font-bold text-[#00d9ff] uppercase tracking-widest bg-[#00d9ff]/5 px-2 py-1 rounded">
                {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#2a2a3a]">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm text-white">{tool.rating}</span>
            <span className="text-xs text-[#94949f]">({tool.reviewCount.toLocaleString()})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}