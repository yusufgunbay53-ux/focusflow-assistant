"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import PomodoroTimer from "@/components/PomodoroTimer";
import AmbientPlayer from "@/components/AmbientPlayer";
import AICoach from "@/components/AICoach";
import { Task, Stats, PomodoroSession, AppState } from "@/types";
import { loadState, saveState, defaultState } from "@/lib/storage";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [stats, setStats] = useState<Stats>(defaultState().stats);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const state = loadState();
    setTasks(state.tasks);
    setSessions(state.sessions);
    setStats(state.stats);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: AppState = { tasks, sessions, stats };
    saveState(state);
  }, [tasks, sessions, stats, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const today = new Date().toISOString().slice(0, 10);
    const completedToday = tasks.filter(
      (t) =>
        t.status === "done" &&
        t.completedAt &&
        new Date(t.completedAt).toISOString().slice(0, 10) === today
    ).length;

    setStats((prev) => {
      if (prev.tasksCompletedToday === completedToday && prev.lastUpdated === today)
        return prev;
      return {
        ...prev,
        tasksCompletedToday: completedToday,
        lastUpdated: today,
      };
    });
  }, [tasks, hydrated]);

  const handleTasksChange = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const handleSessionComplete = useCallback(
    (type: "work" | "break", durationMinutes: number) => {
      const session: PomodoroSession = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        duration: durationMinutes * 60,
        completedAt: Date.now(),
      };
      setSessions((prev) => [...prev, session]);

      if (type === "work") {
        setStats((prev) => ({
          ...prev,
          pomodorosCompletedToday: prev.pomodorosCompletedToday + 1,
          totalFocusMinutesToday: prev.totalFocusMinutesToday + durationMinutes,
          lastUpdated: new Date().toISOString().slice(0, 10),
        }));
      }
    },
    []
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b111e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 animate-pulse" />
          <p className="text-slate-500 text-sm">FocusFlow yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <KanbanBoard tasks={tasks} onTasksChange={handleTasksChange} />
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2 space-y-4">
            <PomodoroTimer onSessionComplete={handleSessionComplete} />
            <AmbientPlayer />
            <AICoach tasks={tasks} stats={stats} sessions={sessions} />
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-600 border-t border-white/5">
        FocusFlow · AI Destekli Odaklanma Asistanı · Veriler localStorage&apos;da saklanır
      </footer>
    </div>
  );
}
