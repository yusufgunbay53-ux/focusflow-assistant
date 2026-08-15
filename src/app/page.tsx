"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AICoach } from "@/components/AICoach";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import { useAppData } from "@/hooks/useAppData";

export default function HomePage() {
  const {
    tasksByStatus,
    stats,
    isHydrated,
    addTask,
    deleteTask,
    moveTask,
    reorderTasks,
    addPomodoroSession,
    ensureDailyStats,
  } = useAppData();

  useEffect(() => {
    if (isHydrated) ensureDailyStats();
  }, [isHydrated, ensureDailyStats]);

  if (!isHydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#00d2ff]/30 border-t-[#00d2ff] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">FocusFlow yükleniyor...</p>
        </div>
      </div>
    );
  }

  const activeTasks =
    tasksByStatus.todo.length + tasksByStatus["in-progress"].length;

  return (
    <div className="min-h-dvh flex flex-col relative z-10">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 order-2 lg:order-1">
            <KanbanBoard
              tasksByStatus={tasksByStatus}
              onAddTask={(title, priority) => addTask(title, priority)}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask}
              onReorder={reorderTasks}
            />
          </section>

          <aside className="lg:col-span-4 space-y-4 order-1 lg:order-2">
            <PomodoroTimer onSessionComplete={addPomodoroSession} />
            <AmbientPlayer />
            <AICoach
              stats={stats}
              activeTasks={activeTasks}
              inProgress={tasksByStatus["in-progress"].length}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/5 py-4 text-center text-[11px] text-slate-600">
        FocusFlow • Veriler tarayıcında saklanır (localStorage)
      </footer>
    </div>
  );
}
