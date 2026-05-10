"use client";

import { useEffect, useState } from "react";
import type { Priority, Project } from "@/types";
import { INBOX_PROJECT_ID, useTodoStore } from "@/store/useStore";

type TaskInputProps = {
  placeholder?: string;
  projects: Project[];
  defaultProjectId?: string;
};

export function TaskInput({
  placeholder = 'Add task — try "내일 회의 준비 @p2"',
  projects,
  defaultProjectId,
}: TaskInputProps) {
  const addTask = useTodoStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("P3");
  const [projectId, setProjectId] = useState(
    defaultProjectId ?? INBOX_PROJECT_ID
  );
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    setProjectId(defaultProjectId ?? INBOX_PROJECT_ID);
  }, [defaultProjectId]);

  function resetForm() {
    setTitle("");
    setPriority("P3");
    setProjectId(defaultProjectId ?? INBOX_PROJECT_ID);
    setDueDate("");
  }

  function submit() {
    const d = dueDate.trim() === "" ? null : dueDate;
    addTask({
      title,
      priority,
      projectId,
      dueDate: d,
    });
    resetForm();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      resetForm();
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm ring-1 ring-neutral-950/5">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-neutral-900 placeholder-neutral-400 outline-none ring-0"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 px-4 py-2.5">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 outline-none hover:border-neutral-300"
          aria-label="프로젝트"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700 outline-none hover:border-neutral-300"
          aria-label="우선순위"
        >
          <option value="P1">P1 긴급</option>
          <option value="P2">P2 보통</option>
          <option value="P3">P3 여유</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-700 outline-none hover:border-neutral-300"
          aria-label="마감일"
        />

        <button
          type="button"
          onClick={submit}
          className="ml-auto rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700"
        >
          Add task
        </button>
      </div>
    </div>
  );
}
