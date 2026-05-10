"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { useTodoStore } from "@/store/useStore";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tasks = useTodoStore((s) => s.tasks);
  const projects = useTodoStore((s) => s.projects);
  const nav = useTodoStore((s) => s.nav);
  const selectView = useTodoStore((s) => s.selectView);
  const selectProject = useTodoStore((s) => s.selectProject);

  const inputDefaultProject = useMemo(() => {
    if (nav.kind === "project") return nav.projectId;
    return undefined;
  }, [nav]);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-white">
        <div className="h-full w-[260px] animate-pulse border-r border-neutral-200 bg-neutral-100" />
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        tasks={tasks}
        projects={projects}
        nav={nav}
        onSelectView={selectView}
        onSelectProject={selectProject}
      />

      <main className="min-w-0 flex-1 bg-white">
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 px-8 py-4 backdrop-blur">
          <TaskInput projects={projects} defaultProjectId={inputDefaultProject} />
        </div>
        <TaskList tasks={tasks} projects={projects} nav={nav} />
      </main>
    </div>
  );
}
