"use client";

import { useMemo } from "react";
import type { Task } from "@/types";
import { compareISODates, todayISO } from "@/lib/dates";

type Props = {
  tasks: Task[];
  /** dashboard: wider layout */
  variant?: "default" | "dashboard";
};

type Row = {
  key: string;
  label: string;
  total: number;
  done: number;
  left: number;
  pct: number;
};

function rowForTasks(key: string, label: string, subset: Task[]): Row {
  const total = subset.length;
  const done = subset.filter((t) => t.completed).length;
  const left = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { key, label, total, done, left, pct };
}

export function ProgressOverview({ tasks, variant = "default" }: Props) {
  const rows = useMemo(() => {
    const t = todayISO();
    const all = rowForTasks("__all__", "전체", tasks);
    const throughToday = tasks.filter(
      (x) => x.dueDate !== null && compareISODates(x.dueDate, t) <= 0
    );
    const future = tasks.filter(
      (x) => x.dueDate !== null && compareISODates(x.dueDate, t) > 0
    );
    const noDue = tasks.filter((x) => x.dueDate === null);
    return [
      all,
      rowForTasks("through-today", "오늘까지(마감 오늘 이하)", throughToday),
      rowForTasks("future", "미래", future),
      rowForTasks("nodue", "기한 없음", noDue),
    ];
  }, [tasks]);

  const wrap =
    variant === "dashboard" ? "w-full" : "mx-auto w-full max-w-3xl px-6 pt-6";

  return (
    <section
      className={`${wrap} ${variant === "dashboard" ? "mt-2" : ""}`}
      aria-labelledby="list-heading"
    >
      <h2
        id="list-heading"
        className="text-xs font-semibold tracking-wide text-neutral-400"
      >
        LIST
      </h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem_3.5rem_minmax(5rem,1fr)] gap-x-2 border-b border-neutral-100 bg-neutral-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          <span>항목</span>
          <span className="text-right">전체</span>
          <span className="text-right">완료</span>
          <span className="text-right">남음</span>
          <span>진행</span>
        </div>
        <ul className="divide-y divide-neutral-100">
          {rows.map((r) => (
            <li
              key={r.key}
              className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem_3.5rem_minmax(5rem,1fr)] items-center gap-x-2 px-3 py-2.5 text-sm"
            >
              <span className="truncate font-medium text-neutral-800">{r.label}</span>
              <span className="text-right tabular-nums text-neutral-600">{r.total}</span>
              <span className="text-right tabular-nums text-emerald-700">{r.done}</span>
              <span className="text-right tabular-nums text-neutral-600">{r.left}</span>
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-9 shrink-0 text-right text-xs tabular-nums text-neutral-500">
                  {r.total === 0 ? "—" : `${r.pct}%`}
                </span>
                <div
                  className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-100"
                  role="progressbar"
                  aria-valuenow={r.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${r.label} 완료율`}
                >
                  <div
                    className="h-full rounded-full bg-red-500 transition-[width]"
                    style={{ width: r.total === 0 ? "0%" : `${r.pct}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
