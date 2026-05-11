"use client";

import type { NavState, Project, Task } from "@/types";
import { filterTasksByNav } from "@/store/useStore";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  projects: Project[];
  nav: NavState;
};

function navTitle(nav: NavState, projects: Project[]): string {
  if (nav.kind === "dashboard") return "대시보드";
  if (nav.kind === "project") {
    return projects.find((p) => p.id === nav.projectId)?.name ?? "Project";
  }
  switch (nav.view) {
    case "today":
      return "Today";
    case "upcoming":
      return "Upcoming";
    case "inbox":
    default:
      return "Inbox";
  }
}

function navSubtitle(nav: NavState): string {
  if (nav.kind === "dashboard") return "";
  if (nav.kind === "project") {
    return "프로젝트에 속한 작업 목록입니다.";
  }
  switch (nav.view) {
    case "today":
      return "마감이 오늘 이전 또는 오늘인 미완료 작업입니다.";
    case "upcoming":
      return "마감일이 미래인 미완료 작업입니다.";
    case "inbox":
    default:
      return "기본 받은 편지함(Inbox 프로젝트)에 들어있는 모든 작업입니다.";
  }
}

export function TaskList({ tasks, projects, nav }: TaskListProps) {
  const list = filterTasksByNav(tasks, nav);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 pb-8 pt-4">
      <header>
        <h1 className="text-[28px] font-bold tracking-tight text-neutral-900">
          {navTitle(nav, projects)}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{navSubtitle(nav)}</p>
        <div className="mt-6 h-px w-full bg-neutral-200" aria-hidden />
      </header>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 py-10 text-center">
          <p className="text-sm font-medium text-neutral-700">할 일이 없습니다</p>
          <p className="mt-2 text-xs text-neutral-500">
            위 입력 상자에서 작업을 추가하거나 다른 뷰로 전환해 보세요.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100 rounded-xl bg-white px-2 py-1 ring-1 ring-neutral-200/80">
          {list.map((t) => (
            <TaskItem key={t.id} task={t} projects={projects} />
          ))}
        </ul>
      )}
    </div>
  );
}
