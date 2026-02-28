"use client"

import { Search } from 'lucide-react'

// 1. Define the interface for the props
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// 2. Pass the props into the component and destructure them
const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="mb-8 w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94949f]" />
        <input
          type="text"
          placeholder="Search AI tools..."
          // 3. Use the props here
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 h-14 bg-[#14141f] border border-[#2a2a3a] rounded-xl text-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00d9ff] transition-all"
        />
      </div>
    </div>
  )
}

export default SearchBar