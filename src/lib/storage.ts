import { AppState, Task, PomodoroSession, Stats } from "@/types";

const STORAGE_KEY = "focusflow-state-v1";

const defaultStats = (): Stats => ({
  tasksCompletedToday: 0,
  pomodorosCompletedToday: 0,
  totalFocusMinutesToday: 0,
  lastUpdated: new Date().toISOString().slice(0, 10),
});

export const defaultState = (): AppState => ({
  tasks: [],
  sessions: [],
  stats: defaultStats(),
});

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    const today = new Date().toISOString().slice(0, 10);
    if (parsed.stats?.lastUpdated !== today) {
      parsed.stats = defaultStats();
    }
    return {
      tasks: parsed.tasks || [],
      sessions: parsed.sessions || [],
      stats: parsed.stats || defaultStats(),
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
