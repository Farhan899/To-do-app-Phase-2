export function TaskSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Checkbox skeleton */}
        <div className="flex-shrink-0 w-[22px] h-[22px] rounded-md bg-gray-200" />

        {/* Content skeleton */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-lg w-full" />
            <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
          </div>
          {/* Meta */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-100 rounded-md" />
            <div className="h-5 w-20 bg-gray-100 rounded-md" />
            <div className="h-4 w-24 bg-gray-50 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskFormSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-gray-200" />
        <div className="flex-1 h-5 bg-gray-100 rounded-lg" />
        <div className="w-20 h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function ProgressCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-6">
        {/* Progress ring skeleton */}
        <div className="w-[72px] h-[72px] rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-7 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-50 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col animate-pulse">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>

      {/* Progress skeleton */}
      <div className="mx-4 mt-4 p-4 rounded-xl bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
        <div className="h-2 bg-gray-200 rounded-full" />
      </div>

      {/* Nav items skeleton */}
      <nav className="flex-1 mt-4 px-2 space-y-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </nav>

      {/* User skeleton */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="px-8 py-4 flex items-center justify-between gap-4 animate-pulse">
        {/* Search skeleton */}
        <div className="flex-1 max-w-md h-10 bg-gray-100 rounded-xl" />

        {/* Actions skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div className="w-28 h-10 bg-gray-200 rounded-xl" />
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </header>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#eff6ff]">
      {/* Sidebar skeleton */}
      <SidebarSkeleton />

      {/* Main content */}
      <div className="ml-[280px] min-h-screen">
        {/* Header skeleton */}
        <HeaderSkeleton />

        {/* Page content skeleton */}
        <main className="px-8 py-8 animate-pulse">
          {/* Greeting skeleton */}
          <div className="mb-8 space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded-lg" />
            <div className="h-5 w-80 bg-gray-100 rounded" />
          </div>

          {/* Form and Progress Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <TaskFormSkeleton />
            </div>
            <div>
              <ProgressCardSkeleton />
            </div>
          </div>

          {/* Tasks section skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>

            <div className="space-y-3">
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
