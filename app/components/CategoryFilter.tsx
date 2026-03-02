"use client"

import { useState, useRef, useEffect } from "react";
import { categories } from "../lib/data";

interface CategoryFilterProps {
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
}

const CategoryFilter = ({ selectedCategories, toggleCategory }: CategoryFilterProps) => {
  // State to control if the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Create a reference to attach to our dropdown container
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. Listen for clicks anywhere on the screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the dropdown is open AND the click happened outside of our ref, close it!
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Attach the listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // 3. Attach the ref to this outermost div
    <div ref={dropdownRef} className="w-full max-w-xs mx-auto mb-12 relative z-40">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-[#5a5a6a] uppercase tracking-widest text-center">
          Filter by Category
        </p>

        {/* The Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-3.5 bg-[#14141f] border border-[#2a2a3a] rounded-xl shadow-xl text-white hover:border-[#00d9ff]/50 transition-colors"
        >
          <span className="text-sm font-medium text-[#94949f]">
            {selectedCategories.length === 0 
              ? "Select categories..." 
              : `${selectedCategories.length} selected`}
          </span>
          
          {/* Dropdown Arrow Icon */}
          <svg 
            className={`w-5 h-5 text-[#94949f] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* The Dropdown Menu (Hidden unless isOpen is true) */}
        {isOpen && (
          <div className="absolute top-[105%] left-0 w-full bg-[#14141f] border border-[#2a2a3a] rounded-xl shadow-2xl max-h-60 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
            {categories.map((categoryName) => (
              <label 
                key={categoryName} 
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer group hover:bg-[#1e1e2e] transition-colors"
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={selectedCategories.includes(categoryName)}
                  onChange={() => toggleCategory(categoryName)}
                />

                <div className="w-5 h-5 border-2 border-[#2a2a3a] rounded-md flex items-center justify-center transition-all duration-200 
                  peer-checked:bg-[#00d9ff] peer-checked:border-[#00d9ff] group-hover:border-[#00d9ff]/50 shrink-0">
                  <svg 
                    className={`w-3.5 h-3.5 text-[#0a0a0f] transition-transform duration-200 ${
                      selectedCategories.includes(categoryName) ? "scale-100" : "scale-0"
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span className="text-sm font-medium text-[#94949f] transition-colors group-hover:text-white peer-checked:text-white truncate">
                  {categoryName}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;