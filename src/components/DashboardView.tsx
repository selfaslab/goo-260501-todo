"use client";

import type { Task } from "@/types";
import { toISODate } from "@/lib/dates";
import { ProgressOverview } from "./ProgressOverview";

type Props = {
  tasks: Task[];
};

export function DashboardView({ tasks }: Props) {
  const dateLabel = new Date().toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const open = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-neutral-50/80">
      <div className="mx-auto max-w-4xl px-8 pb-12 pt-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            {dateLabel} · {toISODate(new Date())}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
            대시보드
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            마감일 기준으로 오늘까지와 미래 작업 진행률을 한눈에 확인합니다.
          </p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-neutral-500">전체 작업</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">{total}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-neutral-500">미완료</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-red-700">{open}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-neutral-500">완료율</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">
              {total === 0 ? "—" : `${pct}%`}
            </p>
          </div>
        </div>

        <ProgressOverview tasks={tasks} variant="dashboard" />
      </div>
    </div>
  );
}
