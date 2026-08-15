"use client";

import { useState, useEffect } from "react";
import { Bot, RefreshCw, Sparkles } from "lucide-react";
import { Task, Stats, PomodoroSession } from "@/types";
import { generateCoachMessage, CoachMessage } from "@/lib/ai-coach";

interface AICoachProps {
  tasks: Task[];
  stats: Stats;
  sessions: PomodoroSession[];
}

export default function AICoach({ tasks, stats, sessions }: AICoachProps) {
  const [message, setMessage] = useState<CoachMessage | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const refresh = () => {
    setIsThinking(true);
    setTimeout(() => {
      const msg = generateCoachMessage(tasks, stats, sessions);
      setMessage(msg);
      setIsThinking(false);
    }, 600 + Math.random() * 400);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(refresh, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.tasksCompletedToday, stats.pomodorosCompletedToday, tasks.length]);

  const typeStyles = {
    encourage: "border-cyan-500/30 bg-cyan-500/5",
    suggest: "border-amber-500/30 bg-amber-500/5",
    celebrate: "border-emerald-500/30 bg-emerald-500/5",
    neutral: "border-white/10 bg-white/5",
  };

  return (
    <div className="glass rounded-2xl border border-cyan-500/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          AI Performans Koçu
        </h3>
        <button
          onClick={refresh}
          disabled={isThinking}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition disabled:opacity-50"
          title="Yenile"
        >
          <RefreshCw className={`w-4 h-4 ${isThinking ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div
        className={`rounded-xl border p-3.5 min-h-[80px] transition-all duration-300 ${
          message ? typeStyles[message.type] : "border-white/10 bg-white/5"
        }`}
      >
        {isThinking ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>Düşünüyor...</span>
          </div>
        ) : message ? (
          <p className="text-sm text-slate-200 leading-relaxed">{message.text}</p>
        ) : (
          <p className="text-sm text-slate-500">Hazır olduğunda bir şeyler söyleyeceğim.</p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/5 py-2">
          <p className="text-lg font-bold text-cyan-300">{stats.tasksCompletedToday}</p>
          <p className="text-[10px] text-slate-500">Görev</p>
        </div>
        <div className="rounded-lg bg-white/5 py-2">
          <p className="text-lg font-bold text-emerald-300">{stats.pomodorosCompletedToday}</p>
          <p className="text-[10px] text-slate-500">Pomodoro</p>
        </div>
        <div className="rounded-lg bg-white/5 py-2">
          <p className="text-lg font-bold text-amber-300">{stats.totalFocusMinutesToday}</p>
          <p className="text-[10px] text-slate-500">Dakika</p>
        </div>
      </div>
    </div>
  );
}
