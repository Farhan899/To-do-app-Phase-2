"use client";

import { useState } from "react";
import { Check, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleTaskCompletion, deleteTask } from "@/lib/api";
import { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: number) => void;
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  async function handleToggle(task: Task) {
    setLoadingTaskId(task.id);
    try {
      const updatedTask = await toggleTaskCompletion(task.id);
      onTaskUpdated(updatedTask);
      toast.success(updatedTask.is_completed ? "Task completed!" : "Task marked incomplete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to toggle task");
    } finally {
      setLoadingTaskId(null);
    }
  }

  async function handleDelete(taskId: number) {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setDeletingTaskId(taskId);
    try {
      await deleteTask(taskId);
      onTaskDeleted(taskId);
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
      setDeletingTaskId(null);
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 transition-opacity ${
            task.is_completed ? "opacity-75" : ""
          } ${deletingTaskId === task.id ? "opacity-50" : ""}`}
        >
          {/* Checkbox */}
          <button
            onClick={() => handleToggle(task)}
            disabled={loadingTaskId === task.id || deletingTaskId === task.id}
            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors disabled:cursor-not-allowed ${
              task.is_completed
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-green-500"
            }`}
          >
            {loadingTaskId === task.id ? (
              <Loader2 size={16} className="animate-spin text-gray-500" />
            ) : (
              task.is_completed && <Check size={16} className="text-white" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-medium ${
                task.is_completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Created {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(task.id)}
            disabled={deletingTaskId === task.id || loadingTaskId === task.id}
            className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete task"
          >
            {deletingTaskId === task.id ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Trash2 size={20} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
