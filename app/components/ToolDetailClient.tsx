"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AITool } from "../lib/data";
import { toggleSaveTool } from "@/app/actions/saved-tools";
import { 
  Star, ExternalLink, ArrowLeft, Bookmark, 
  BookmarkCheck, Play, CheckCircle2 
} from "lucide-react";
import { motion } from "motion/react";

export default function ToolDetailClient({ 
  tool, 
  isSavedInitial 
}: { 
  tool: AITool; 
  isSavedInitial: boolean 
}) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    startTransition(async () => {
      try {
        await toggleSaveTool(tool.id);
      } catch {
        setIsSaved(isSavedInitial);
        alert("Please login to save tools!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center mb-8 text-[#94949f] hover:text-[#00d9ff] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#14141f] border border-[#2a2a3a] rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-[#2a2a3a]">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="text-8xl bg-[#1e1e2e] p-6 rounded-3xl border border-[#2a2a3a]">
                  {tool.logo}
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3">{tool.name}</h1>
                  <p className="text-xl text-[#94949f] mb-6 max-w-xl">{tool.tagline}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {tool.category.map((cat) => (
                      <span key={cat} className="px-4 py-1.5 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/20 text-[#00d9ff] text-sm font-semibold">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleSave}
                disabled={isPending}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all border ${
                  isSaved 
                    ? "bg-[#00d9ff] border-[#00d9ff] text-[#0a0a0f]" 
                    : "bg-transparent border-[#2a2a3a] text-white hover:border-[#00d9ff]"
                }`}
              >
                {isSaved ? (
                  <> <BookmarkCheck className="w-5 h-5" /> Saved </>
                ) : (
                  <> <Bookmark className="w-5 h-5" /> Save Tool </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-[#2a2a3a]/50">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                <span className="text-2xl font-bold">{tool.rating}</span>
                <span className="text-[#94949f]">({tool.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-[#2a2a3a]" />
              <div className="text-lg">
                <span className="text-[#94949f]">Pricing:</span> <span className="font-semibold">{tool.pricing}</span>
              </div>
            </div>
          </div>

          {/* PLAYABLE VIDEO SECTION */}
          {tool.videoUrl && (
            <div className="p-8 md:p-12 border-b border-[#2a2a3a] bg-[#1e1e2e]/30">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Play className="w-6 h-6 text-[#00d9ff]" /> Product Demo
              </h2>
              {/* Responsive Iframe Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#2a2a3a] shadow-lg bg-black">
                <iframe 
                  src={tool.videoUrl} 
                  title={`${tool.name} demo video`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy" /* This is the magic for fast page loads! */
                ></iframe>
              </div>
            </div>
          )}

          {/* Description & Features */}
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#2a2a3a]">
              <h2 className="text-2xl font-bold mb-6">About the Tool</h2>
              <p className="text-lg text-[#94949f] leading-relaxed italic">
                &ldquo;{tool.description}&rdquo;
              </p>
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6">Capabilities</h2>
              <ul className="space-y-4">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-4 text-[#94949f]">
                    <CheckCircle2 className="w-5 h-5 text-[#00d9ff] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-12 bg-gradient-to-t from-[#00d9ff]/5 to-transparent text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to boost your workflow?</h2>
            <a 
              href={tool.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#00d9ff] text-[#0a0a0f] rounded-2xl font-extrabold text-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,217,255,0.3)]"
            >
              Get Started with {tool.name} <ExternalLink className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}