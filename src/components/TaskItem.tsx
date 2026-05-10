"use client";

import { useMemo, useState } from "react";
import type { Priority, Project, Task } from "@/types";
import { useTodoStore } from "@/store/useStore";

type TaskItemProps = {
  task: Task;
  projects: Project[];
};

function priorityPill(priority: Priority) {
  switch (priority) {
    case "P1":
      return "border-red-200 bg-red-50 text-red-700";
    case "P2":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "P3":
    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-600";
  }
}

export function TaskItem({ task, projects }: TaskItemProps) {
  const updateTask = useTodoStore((s) => s.updateTask);
  const removeTask = useTodoStore((s) => s.removeTask);
  const toggleTask = useTodoStore((s) => s.toggleTask);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const projectName = useMemo(
    () => projects.find((p) => p.id === task.projectId)?.name ?? "Project",
    [projects, task.projectId]
  );

  function commitTitle() {
    const t = draftTitle.trim();
    if (!t) {
      removeTask(task.id);
      return;
    }
    updateTask(task.id, { title: t });
    setDraftTitle(t);
    setEditingTitle(false);
  }

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 hover:bg-neutral-50 hover:border-neutral-100">
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-pressed={task.completed}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          task.completed
            ? "border-red-500 bg-red-500 text-white"
            : "border-neutral-300 bg-white hover:border-red-400"
        }`}
      >
        {task.completed && (
          <span className="text-[11px] font-bold leading-none">✓</span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        {editingTitle ? (
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            autoFocus
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setDraftTitle(task.title);
                setEditingTitle(false);
              }
            }}
            className="w-full rounded border border-neutral-200 px-2 py-1 text-[15px] text-neutral-900 outline-none ring-2 ring-transparent focus:border-red-300 focus:ring-red-500/25"
          />
        ) : (
          <button
            type="button"
            className={`block max-w-full text-left text-[15px] ${
              task.completed
                ? "text-neutral-400 line-through"
                : "text-neutral-900"
            }`}
            onDoubleClick={() => {
              setDraftTitle(task.title);
              setEditingTitle(true);
            }}
          >
            {task.title}
          </button>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-neutral-600">
            {projectName}
          </span>
          <select
            value={task.priority}
            onChange={(e) =>
              updateTask(task.id, {
                priority: e.target.value as Priority,
              })
            }
            className={`rounded border px-2 py-0.5 font-semibold outline-none hover:opacity-90 ${priorityPill(task.priority)}`}
            aria-label="우선순위 변경"
          >
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
          <input
            type="date"
            value={task.dueDate ?? ""}
            onChange={(e) =>
              updateTask(task.id, {
                dueDate: e.target.value === "" ? null : e.target.value,
              })
            }
            className="rounded border border-neutral-200 px-2 py-0.5 font-medium text-neutral-600 outline-none"
            aria-label="마감일"
          />

          <select
            value={task.projectId}
            onChange={(e) =>
              updateTask(task.id, { projectId: e.target.value })
            }
            className="ml-auto rounded border border-neutral-200 bg-white px-2 py-0.5 text-neutral-700 opacity-90 group-hover:opacity-100 md:opacity-70"
            aria-label="프로젝트 변경"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => removeTask(task.id)}
            className="rounded px-2 py-0.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
