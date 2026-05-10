"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NavState, Priority, Project, Task, ViewMode } from "@/types";
import { compareISODates, todayISO } from "@/lib/dates";

export const INBOX_PROJECT_ID = "proj-inbox";

const DEFAULT_PROJECTS: Project[] = [
  { id: INBOX_PROJECT_ID, name: "Inbox" },
  { id: "proj-work", name: "Work" },
  { id: "proj-personal", name: "Personal" },
];

type TodoState = {
  nav: NavState;
  tasks: Task[];
  projects: Project[];
};

type TodoActions = {
  setNav: (nav: NavState) => void;
  selectView: (view: ViewMode) => void;
  selectProject: (projectId: string) => void;
  addTask: (input: {
    title: string;
    priority: Priority;
    projectId: string;
    dueDate: string | null;
  }) => void;
  updateTask: (
    id: string,
    patch: Partial<
      Pick<Task, "title" | "priority" | "dueDate" | "projectId" | "completed">
    >
  ) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
};

export function filterTasksByNav(tasks: Task[], nav: NavState): Task[] {
  const t = todayISO();

  const byView = (view: ViewMode): Task[] => {
    switch (view) {
      case "inbox":
        return tasks.filter((x) => x.projectId === INBOX_PROJECT_ID);
      case "today":
        return tasks.filter(
          (x) =>
            x.dueDate !== null &&
            compareISODates(x.dueDate, t) <= 0 &&
            !x.completed
        );
      case "upcoming":
        return tasks.filter(
          (x) =>
            x.dueDate !== null && compareISODates(x.dueDate, t) > 0 && !x.completed
        );
      default:
        return tasks;
    }
  };

  if (nav.kind === "project") {
    return [...tasks]
      .filter((x) => x.projectId === nav.projectId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  const list = byView(nav.view);
  let sorted: Task[];
  if (nav.view === "inbox") {
    const order: Record<Priority, number> = { P1: 0, P2: 1, P3: 2 };
    sorted = [...list].sort((a, b) => {
      const done = Number(a.completed) - Number(b.completed);
      if (done !== 0) return done;
      const pr =
        order[a.priority] !== order[b.priority]
          ? order[a.priority] - order[b.priority]
          : 0;
      if (pr !== 0) return pr;
      return b.updatedAt - a.updatedAt;
    });
  } else {
    sorted = [...list].sort((a, b) =>
      compareISODates(
        a.dueDate ?? "9999-12-31",
        b.dueDate ?? "9999-12-31"
      )
    );
  }
  return sorted;
}

function mergeProjects(loaded?: Project[]): Project[] {
  const base = [...(loaded ?? [])];
  const map = new Map(base.map((p) => [p.id, p]));
  for (const d of DEFAULT_PROJECTS) {
    if (!map.has(d.id)) {
      map.set(d.id, d);
      base.push(d);
    }
  }
  return [...map.values()].sort((a, b) => {
    if (a.id === INBOX_PROJECT_ID) return -1;
    if (b.id === INBOX_PROJECT_ID) return 1;
    return a.name.localeCompare(b.name, "ko");
  });
}

export const useTodoStore = create<TodoState & TodoActions>()(
  persist(
    (set, get) => ({
      nav: { kind: "view", view: "inbox" },
      tasks: [],
      projects: DEFAULT_PROJECTS,

      setNav: (nav) => set({ nav }),

      selectView: (view) =>
        set({
          nav: { kind: "view", view },
        }),

      selectProject: (projectId) =>
        set({
          nav: { kind: "project", projectId },
        }),

      addTask: ({ title, priority, projectId, dueDate }) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const task: Task = {
          id: crypto.randomUUID(),
          title: trimmed,
          completed: false,
          priority,
          dueDate,
          projectId,
          updatedAt: Date.now(),
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
      },

      updateTask: (id, patch) => {
        set((s) => ({
          tasks: s.tasks.map((x) =>
            x.id === id ? { ...x, ...patch, updatedAt: Date.now() } : x
          ),
        }));
      },

      removeTask: (id) => {
        set((s) => ({
          tasks: s.tasks.filter((x) => x.id !== id),
        }));
      },

      toggleTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        get().updateTask(id, { completed: !task.completed });
      },
    }),
    {
      name: "goorm-todo-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tasks: s.tasks,
        projects: s.projects,
        nav: s.nav,
      }),
      merge: (persistedState, currentState) => {
        const p = (persistedState ?? {}) as Partial<TodoState>;
        return {
          ...currentState,
          tasks: Array.isArray(p.tasks) ? p.tasks : currentState.tasks,
          nav: p.nav ?? currentState.nav,
          projects: mergeProjects(
            Array.isArray(p.projects) ? p.projects : currentState.projects
          ),
        };
      },
    }
  )
);
