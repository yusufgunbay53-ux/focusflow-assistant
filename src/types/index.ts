export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
  order: number;
}

export interface PomodoroSession {
  id: string;
  type: "work" | "break";
  duration: number; // seconds
  completedAt: number;
}

export interface Stats {
  tasksCompletedToday: number;
  pomodorosCompletedToday: number;
  totalFocusMinutes: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface AppData {
  tasks: Task[];
  sessions: PomodoroSession[];
  stats: Stats;
}
