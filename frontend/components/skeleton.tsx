export function TaskSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start gap-4 animate-pulse">
      {/* Checkbox skeleton */}
      <div className="flex-shrink-0 w-6 h-6 rounded border-2 border-gray-200 bg-gray-100" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        {/* Description */}
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        {/* Date */}
        <div className="h-3 bg-gray-100 rounded w-32" />
      </div>

      {/* Delete button skeleton */}
      <div className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded" />
    </div>
  );
}

export function TaskFormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32 mb-4" />

      <div className="space-y-4">
        {/* Title input skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
          <div className="h-10 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-24 mt-1" />
        </div>

        {/* Description textarea skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
          <div className="h-24 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-28 mt-1" />
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task form skeleton */}
        <div className="mb-8">
          <TaskFormSkeleton />
        </div>

        {/* Task list skeleton */}
        <div className="space-y-4">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      </main>
    </div>
  );
}
