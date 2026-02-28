"use client"

import { categories } from "../lib/data";

interface CategoryFilterProps {
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
}

const CategoryFilter = ({ selectedCategories, toggleCategory }: CategoryFilterProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-[#14141f] border border-[#2a2a3a] rounded-2xl shadow-xl">
        <p className="text-xs font-bold text-[#5a5a6a] uppercase tracking-widest mr-2">
          Categories
        </p>

        {categories.map((categoryName) => {
          // We use the string from your data.ts as the ID and the Label
          // This ensures matchesCategory in ToolDiscovery actually works!
          const categoryId = categoryName; 

          return (
            <label 
              key={categoryId} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="sr-only peer"
                checked={selectedCategories.includes(categoryId)}
                onChange={() => toggleCategory(categoryId)}
              />

              <div className="w-5 h-5 border-2 border-[#2a2a3a] rounded-md flex items-center justify-center transition-all duration-200 
                peer-checked:bg-[#00d9ff] peer-checked:border-[#00d9ff] group-hover:border-[#00d9ff]/50">
                
                <svg 
                  className={`w-3.5 h-3.5 text-[#0a0a0f] transition-transform duration-200 ${
                    selectedCategories.includes(categoryId) ? "scale-100" : "scale-0"
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <span className="text-sm font-medium text-[#94949f] transition-colors group-hover:text-white peer-checked:text-white">
                {categoryName}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;