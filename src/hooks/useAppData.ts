"use client";

import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./useLocalStorage";
import type { Task, Priority, TaskStatus, PomodoroSession, Stats, AppData } from "@/types";

const STORAGE_KEY = "focusflow-data-v1";

const defaultStats: Stats = {
  tasksCompletedToday: 0,
  pomodorosCompletedToday: 0,
  totalFocusMinutes: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
};

const defaultData: AppData = {
  tasks: [],
  sessions: [],
  stats: defaultStats,
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function useAppData() {
  const [data, setData, isHydrated] = useLocalStorage<AppData>(STORAGE_KEY, defaultData);

  const ensureDailyStats = useCallback(() => {
    const today = getToday();
    if (data.stats.lastActiveDate !== today) {
      setData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          tasksCompletedToday: 0,
          pomodorosCompletedToday: 0,
          lastActiveDate: today,
        },
      }));
    }
  }, [data.stats.lastActiveDate, setData]);

  const addTask = useCallback(
    (title: string, priority: Priority = "medium", description?: string) => {
      const newTask: Task = {
        id: uuidv4(),
        title,
        description,
        priority,
        status: "todo",
        createdAt: Date.now(),
        order: data.tasks.filter((t) => t.status === "todo").length,
      };
      setData((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
      return newTask;
    },
    [data.tasks, setData]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));
    },
    [setData]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
      }));
    },
    [setData]
  );

  const moveTask = useCallback(
    (id: string, newStatus: TaskStatus, newOrder?: number) => {
      setData((prev) => {
        const task = prev.tasks.find((t) => t.id === id);
        if (!task) return prev;

        const wasDone = task.status === "done";
        const isNowDone = newStatus === "done";
        let stats = { ...prev.stats };

        if (!wasDone && isNowDone) {
          const today = getToday();
          if (stats.lastActiveDate !== today) {
            stats = {
              ...stats,
              tasksCompletedToday: 1,
              pomodorosCompletedToday: 0,
              lastActiveDate: today,
            };
          } else {
            stats.tasksCompletedToday += 1;
          }
        }

        const updatedTasks = prev.tasks.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              status: newStatus,
              order: newOrder ?? t.order,
              completedAt: isNowDone ? Date.now() : undefined,
            };
          }
          return t;
        });

        return { ...prev, tasks: updatedTasks, stats };
      });
    },
    [setData]
  );

  const reorderTasks = useCallback(
    (status: TaskStatus, orderedIds: string[]) => {
      setData((prev) => {
        const otherTasks = prev.tasks.filter((t) => t.status !== status);
        const statusTasks = orderedIds
          .map((id, index) => {
            const t = prev.tasks.find((x) => x.id === id);
            return t ? { ...t, order: index } : null;
          })
          .filter(Boolean) as Task[];
        return { ...prev, tasks: [...otherTasks, ...statusTasks] };
      });
    },
    [setData]
  );

  const addPomodoroSession = useCallback(
    (type: "work" | "break", durationSeconds: number) => {
      const session: PomodoroSession = {
        id: uuidv4(),
        type,
        duration: durationSeconds,
        completedAt: Date.now(),
      };
      setData((prev) => {
        const today = getToday();
        let stats = { ...prev.stats };
        if (stats.lastActiveDate !== today) {
          stats = {
            tasksCompletedToday: 0,
            pomodorosCompletedToday: type === "work" ? 1 : 0,
            totalFocusMinutes:
              type === "work"
                ? Math.round(durationSeconds / 60)
                : 0,
            lastActiveDate: today,
          };
        } else if (type === "work") {
          stats.pomodorosCompletedToday += 1;
          stats.totalFocusMinutes += Math.round(durationSeconds / 60);
        }
        return {
          ...prev,
          sessions: [...prev.sessions.slice(-49), session],
          stats,
        };
      });
    },
    [setData]
  );

  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    data.tasks.forEach((t) => {
      groups[t.status].push(t);
    });
    Object.keys(groups).forEach((key) => {
      groups[key as TaskStatus].sort((a, b) => a.order - b.order);
    });
    return groups;
  }, [data.tasks]);

  return {
    tasks: data.tasks,
    tasksByStatus,
    sessions: data.sessions,
    stats: data.stats,
    isHydrated,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    addPomodoroSession,
    ensureDailyStats,
  };
}
