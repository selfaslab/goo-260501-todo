"use client";

import { useMemo } from "react";
import type { NavState, Project, Task, ViewMode } from "@/types";
import { compareISODates, todayISO } from "@/lib/dates";
import { INBOX_PROJECT_ID } from "@/store/useStore";

type SidebarProps = {
  tasks: Task[];
  projects: Project[];
  nav: NavState;
  onSelectDashboard: () => void;
  onSelectView: (view: ViewMode) => void;
  onSelectProject: (projectId: string) => void;
};

const viewItems: {
  view: ViewMode;
  label: string;
  icon: string;
}[] = [
  { view: "inbox", label: "Inbox", icon: "📥" },
  { view: "today", label: "Today", icon: "☀️" },
  { view: "upcoming", label: "Upcoming", icon: "📅" },
];

function badgeClass(c: number) {
  if (c <= 0) return "text-gray-400";
  return "text-gray-700 bg-neutral-100";
}

export function Sidebar({
  tasks,
  projects,
  nav,
  onSelectDashboard,
  onSelectView,
  onSelectProject,
}: SidebarProps) {
  const counts = useMemo(() => {
    const t = todayISO();
    return {
      inbox: tasks.filter((x) => x.projectId === INBOX_PROJECT_ID).length,
      today: tasks.filter(
        (x) =>
          x.dueDate !== null &&
          compareISODates(x.dueDate, t) <= 0 &&
          !x.completed
      ).length,
      upcoming: tasks.filter(
        (x) =>
          x.dueDate !== null &&
          compareISODates(x.dueDate, t) > 0 &&
          !x.completed
      ).length,
    };
  }, [tasks]);

  const projectCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of projects) {
      m.set(p.id, tasks.filter((t) => t.projectId === p.id && !t.completed).length);
    }
    return m;
  }, [tasks, projects]);

  const isDashboard = nav.kind === "dashboard";

  function isViewActive(view: ViewMode) {
    return nav.kind === "view" && nav.view === view;
  }

  function isProjectActive(pid: string) {
    return nav.kind === "project" && nav.projectId === pid;
  }

  return (
    <aside className="flex h-full min-h-0 w-[260px] flex-shrink-0 flex-col border-r border-neutral-200 bg-sidebar">
      <div className="border-b border-neutral-200 px-4 py-4">
        <button
          type="button"
          onClick={onSelectDashboard}
          className={`w-full rounded-lg px-1 py-1 text-left text-2xl font-bold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${
            isDashboard
              ? "bg-red-600/10 text-red-700"
              : "text-neutral-900 hover:bg-neutral-200/60 hover:text-red-700"
          }`}
          aria-label="대시보드로 이동"
        >
          My tasks
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Views
        </p>
        <ul className="space-y-0.5">
          {viewItems.map(({ view, label, icon }) => {
            const active = isViewActive(view);
            const c =
              view === "inbox"
                ? counts.inbox
                : view === "today"
                  ? counts.today
                  : counts.upcoming;
            return (
              <li key={view}>
                <button
                  type="button"
                  onClick={() => onSelectView(view)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                    active
                      ? "bg-red-600/10 text-red-700"
                      : "text-neutral-700 hover:bg-neutral-200/70"
                  }`}
                >
                  <span className="text-base leading-none">{icon}</span>
                  <span className="flex-1 truncate font-medium">{label}</span>
                  <span
                    className={`min-w-[1.25rem] rounded px-1.5 py-0.5 text-center text-xs ${badgeClass(c)}`}
                  >
                    {c || ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Projects
        </p>
        <ul className="space-y-0.5">
          {projects.map((p) => {
            const active = isProjectActive(p.id);
            const c = projectCounts.get(p.id) ?? 0;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelectProject(p.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                    active
                      ? "bg-red-600/10 text-red-700"
                      : "text-neutral-700 hover:bg-neutral-200/70"
                  }`}
                >
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full bg-neutral-300"
                    aria-hidden
                  />
                  <span className="flex-1 truncate font-medium">{p.name}</span>
                  <span
                    className={`min-w-[1.25rem] rounded px-1.5 py-0.5 text-center text-xs ${badgeClass(c)}`}
                  >
                    {c || ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-200 px-4 py-3 text-xs text-neutral-400">
        Local · saved in browser
      </div>
    </aside>
  );
}
