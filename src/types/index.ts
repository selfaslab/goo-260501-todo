export type Priority = "P1" | "P2" | "P3";

export type ViewMode = "inbox" | "today" | "upcoming";

/** YYYY-MM-DD */
export type ISODate = string;

export type Project = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  /** Optional due date */
  dueDate: ISODate | null;
  projectId: string;
  updatedAt: number;
};

export type NavState =
  | { kind: "dashboard" }
  | { kind: "view"; view: ViewMode }
  | { kind: "project"; projectId: string };
