"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardView } from "@/components/DashboardView";
import { Sidebar } from "@/components/Sidebar";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { useTodoStore } from "@/store/useStore";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const tasks = useTodoStore((s) => s.tasks);
  const projects = useTodoStore((s) => s.projects);
  const nav = useTodoStore((s) => s.nav);
  const selectDashboard = useTodoStore((s) => s.selectDashboard);
  const selectView = useTodoStore((s) => s.selectView);
  const selectProject = useTodoStore((s) => s.selectProject);

  const isDashboard = nav.kind === "dashboard";

  const inputDefaultProject = useMemo(() => {
    if (nav.kind === "project") return nav.projectId;
    return undefined;
  }, [nav]);

  if (!mounted) {
    return (
      <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden bg-white">
        <div className="h-full w-[260px] animate-pulse border-r border-neutral-200 bg-neutral-100" />
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden bg-white">
      <Sidebar
        tasks={tasks}
        projects={projects}
        nav={nav}
        onSelectDashboard={selectDashboard}
        onSelectView={selectView}
        onSelectProject={selectProject}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        {isDashboard ? (
          <DashboardView tasks={tasks} />
        ) : (
          <>
            <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 px-8 py-4 backdrop-blur">
              <TaskInput projects={projects} defaultProjectId={inputDefaultProject} />
            </div>
            <TaskList tasks={tasks} projects={projects} nav={nav} />
          </>
        )}
      </main>
    </div>
  );
}
