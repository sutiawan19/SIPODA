export default function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-neutral-200 p-10 text-center animate-pulse">
        
        {/* Icon Skeleton */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-neutral-200 rounded-full"></div>
        </div>
        
        {/* Title Skeleton */}
        <div className="flex justify-center mb-4">
          <div className="h-8 w-48 bg-neutral-200 rounded-lg"></div>
        </div>
        
        {/* Paragraph Skeleton */}
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-neutral-100 rounded-md"></div>
          <div className="h-4 w-full bg-neutral-100 rounded-md"></div>
          <div className="h-4 w-3/4 bg-neutral-100 rounded-md mx-auto"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full bg-neutral-200 rounded-md"></div>
        
      </div>
    </div>
  );
}
