"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { listTasks } from "@/lib/api";
import { Task } from "@/lib/types";
import TaskList from "@/components/task-list";
import TaskForm from "@/components/task-form";
import { DashboardSkeleton } from "@/components/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuthAndLoadTasks();
  }, []);

  async function checkAuthAndLoadTasks() {
    try {
      const session = await authClient.getSession();

      if (!session?.data?.user) {
        router.push("/auth/signin");
        return;
      }

      // Load tasks
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm onTaskCreated={(newTask) => setTasks([newTask, ...tasks])} />
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks yet. Create your first task above!</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskUpdated={(updatedTask) => {
              setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
            }}
            onTaskDeleted={(taskId) => {
              setTasks(tasks.filter((t) => t.id !== taskId));
            }}
          />
        )}
      </main>
    </div>
  );
}
