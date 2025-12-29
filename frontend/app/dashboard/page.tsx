"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Bell, X } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { listTasks } from "@/lib/api";
import { Task } from "@/lib/types";
import TaskList, { EmptyState } from "@/components/task-list";
import TaskForm from "@/components/task-form";
import Sidebar from "@/components/sidebar";
import { DailyProgressCard } from "@/components/progress-ring";
import { DashboardSkeleton } from "@/components/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthAndLoadTasks();
  }, []);

  // Close quick add on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setShowQuickAdd(false);
      }
    }
    if (showQuickAdd) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showQuickAdd]);

  async function checkAuthAndLoadTasks() {
    try {
      const session = await authClient.getSession();

      if (!session?.data?.user) {
        router.push("/auth/signin");
        return;
      }

      setUserName(session.data.user.name || "User");
      setUserEmail(session.data.user.email || "");

      const fetchedTasks = await listTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/auth/signin");
  }

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Calculate today's progress
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter((task) => {
      const taskDate = task.due_date || task.created_at.split("T")[0];
      return taskDate === today || (task.due_date && task.due_date <= today && !task.is_completed);
    });
    // If no tasks match the filter, show all tasks as "today" for demo purposes
    const relevantTasks = todayTasks.length > 0 ? todayTasks : tasks;
    return {
      total: relevantTasks.length,
      completed: relevantTasks.filter((t) => t.is_completed).length,
    };
  }, [tasks]);

  // Get greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar
        activeItem="today"
        onLogout={handleLogout}
        userName={userName}
        userEmail={userEmail}
        completedToday={todayStats.completed}
        totalToday={todayStats.total}
      />

      {/* Main Content */}
      <div className="ml-[280px] min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass-header border-b border-gray-100">
          <div className="px-8 py-4 flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
              </button>

              {/* Quick Add Button */}
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={18} />
                <span className="text-sm font-medium">New Task</span>
              </button>

              {/* Profile Avatar */}
              <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium hover:ring-2 hover:ring-blue-200 transition-all">
                {userName.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        {/* Quick Add Modal */}
        {showQuickAdd && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowQuickAdd(false)}
            />
            <div ref={quickAddRef} className="relative w-full max-w-lg animate-scale-in">
              <TaskForm
                onTaskCreated={(newTask) => {
                  setTasks([newTask, ...tasks]);
                  setShowQuickAdd(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="px-8 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 animate-fade-in">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Greeting & Stats */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              {greeting}, {userName.split(" ")[0]}!
            </h1>
            <p className="text-gray-500">
              {todayStats.total === 0
                ? "You have no tasks scheduled. Create one to get started!"
                : todayStats.completed === todayStats.total
                ? "All tasks completed! Great work!"
                : `You have ${todayStats.total - todayStats.completed} task${
                    todayStats.total - todayStats.completed !== 1 ? "s" : ""
                  } to complete today.`}
            </p>
          </div>

          {/* Progress Card & Task Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <TaskForm onTaskCreated={(newTask) => setTasks([newTask, ...tasks])} />
            </div>
            <div>
              <DailyProgressCard
                completed={todayStats.completed}
                total={todayStats.total}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {searchQuery ? "Search Results" : "All Tasks"}
              </h2>
              {filteredTasks.length > 0 && (
                <span className="text-sm text-gray-500">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No tasks found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <EmptyState />
              )
            ) : (
              <TaskList
                tasks={filteredTasks}
                onTaskUpdated={(updatedTask) => {
                  setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
                }}
                onTaskDeleted={(taskId) => {
                  setTasks(tasks.filter((t) => t.id !== taskId));
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
