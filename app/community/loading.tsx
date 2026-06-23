export default function CommunityLoading() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div>
        <div className="h-8 w-56 bg-[#27272a] rounded-md animate-pulse"></div>
        <div className="h-4 w-72 bg-[#27272a]/50 rounded-md animate-pulse mt-2"></div>
      </div>

      <div className="w-full">
        {/* Tabs Skeleton */}
        <div className="grid w-full grid-cols-2 bg-[#18181b] border border-[#27272a] mb-8 rounded-md h-10 p-1 gap-2">
          <div className="h-full w-full bg-[#27272a] rounded-sm animate-pulse"></div>
          <div className="h-full w-full bg-transparent"></div>
        </div>

        {/* Feed Content Skeleton */}
        <div className="bg-[#18181b] rounded-2xl border border-[#27272a] p-4 sm:p-6 shadow-xl space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-[#27272a]/50">
              <div className="w-12 h-12 rounded-full bg-[#27272a] animate-pulse flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-[#27272a] rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-[#27272a]/50 rounded animate-pulse"></div>
                </div>
                <div className="h-20 w-full bg-[#27272a]/30 rounded-lg animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-[#27272a]/50 rounded-full animate-pulse"></div>
                  <div className="h-6 w-16 bg-[#27272a]/50 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
