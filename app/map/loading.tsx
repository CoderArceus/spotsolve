export default function MapLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="h-8 w-48 bg-[#27272a] rounded-md animate-pulse"></div>
        <div className="h-4 w-72 bg-[#27272a]/50 rounded-md animate-pulse mt-2"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 text-center">
            <div className="h-8 w-16 bg-[#27272a] rounded-md animate-pulse mx-auto mb-2"></div>
            <div className="h-3 w-24 bg-[#27272a]/50 rounded-md animate-pulse mx-auto"></div>
          </div>
        ))}
      </div>

      <div className="w-full h-[480px] bg-[#18181b] rounded-2xl border border-[#27272a] p-4 shadow-xl">
        <div className="w-full h-full bg-[#27272a]/30 rounded-xl animate-pulse flex items-center justify-center">
          <div className="text-[#71717a] font-medium flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
            Loading map data...
          </div>
        </div>
      </div>
    </div>
  );
}
