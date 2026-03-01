export default function BookmarksLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          {/* Icon placeholder */}
          <div className="w-[60px] h-[60px] bg-[#1e1e2e] rounded-2xl border border-[#2a2a3a]"></div>
          {/* Title placeholder */}
          <div className="h-12 w-64 md:w-80 bg-[#1e1e2e] rounded-xl border border-[#2a2a3a]"></div>
        </div>
        {/* Subtitle placeholder */}
        <div className="h-6 w-64 bg-[#1e1e2e] rounded-lg border border-[#2a2a3a]"></div>
      </div>

      {/* Counter & Action Bar Skeleton */}
      <div className="flex items-center justify-between mb-6 border-b border-[#2a2a3a] pb-4">
        <div className="h-5 w-40 bg-[#1e1e2e] rounded-md border border-[#2a2a3a]"></div>
        <div className="h-5 w-32 bg-[#1e1e2e] rounded-md border border-[#2a2a3a]"></div>
      </div>

      {/* Grid of Skeleton Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-[#14141f] border border-[#2a2a3a] rounded-3xl p-6 h-[280px] flex flex-col justify-between"
          >
            <div>
              {/* Card Header (Logo + Bookmark space) */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-[#1e1e2e] rounded-2xl border border-[#2a2a3a]"></div>
                <div className="w-8 h-8 bg-[#1e1e2e] rounded-lg border border-[#2a2a3a]"></div>
              </div>
              
              {/* Card Title & Text */}
              <div className="h-7 w-3/4 bg-[#1e1e2e] rounded-lg mb-4"></div>
              <div className="h-4 w-full bg-[#1e1e2e] rounded-md mb-2"></div>
              <div className="h-4 w-5/6 bg-[#1e1e2e] rounded-md mb-2"></div>
              <div className="h-4 w-4/6 bg-[#1e1e2e] rounded-md"></div>
            </div>
            
            {/* Card Tags (Bottom) */}
            <div className="flex gap-2 mt-6">
               <div className="h-6 w-20 bg-[#1e1e2e] rounded-full"></div>
               <div className="h-6 w-24 bg-[#1e1e2e] rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}