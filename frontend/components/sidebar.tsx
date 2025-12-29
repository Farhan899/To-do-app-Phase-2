"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  FolderKanban,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  LogOut,
} from "lucide-react";

type NavItem = "today" | "upcoming" | "projects" | "calendar" | "settings";

interface SidebarProps {
  activeItem?: NavItem;
  onNavigate?: (item: NavItem) => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  completedToday?: number;
  totalToday?: number;
}

export default function Sidebar({
  activeItem = "today",
  onNavigate,
  onLogout,
  userName = "User",
  userEmail = "",
  completedToday = 0,
  totalToday = 0,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: { id: NavItem; label: string; icon: typeof Sun }[] = [
    { id: "today", label: "Today", icon: Sun },
    { id: "upcoming", label: "Upcoming", icon: CalendarDays },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const progress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-40 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      }`}
      style={{
        boxShadow: "2px 0 8px rgba(0,0,0,0.03)",
      }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <CheckCircle2 size={22} className="text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-800">TaskFlow</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Daily Progress */}
      {!isCollapsed && totalToday > 0 && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Today's Progress</span>
            <span className="text-sm font-semibold text-blue-600">
              {completedToday}/{totalToday}
            </span>
          </div>
          <div className="h-2 bg-blue-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="mt-2 text-xs text-blue-600 font-medium">
              All done for today!
            </p>
          )}
        </div>
      )}

      {/* Collapsed Progress Ring */}
      {isCollapsed && totalToday > 0 && (
        <div className="flex justify-center mt-4">
          <div className="relative w-12 h-12">
            <svg className="progress-ring w-12 h-12" viewBox="0 0 48 48">
              <circle
                className="text-gray-200"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="18"
                cx="24"
                cy="24"
              />
              <circle
                className="text-blue-500 progress-ring__circle"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="18"
                cx="24"
                cy="24"
                style={{
                  strokeDasharray: `${2 * Math.PI * 18}`,
                  strokeDashoffset: `${2 * Math.PI * 18 * (1 - progress / 100)}`,
                }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-blue-600" : "text-gray-500"}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-gray-100">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
              {userEmail && (
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              )}
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
