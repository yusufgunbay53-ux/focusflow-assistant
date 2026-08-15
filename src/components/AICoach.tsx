"use client";

import { useMemo } from "react";
import { Sparkles, TrendingUp, Coffee, Zap } from "lucide-react";
import type { Stats } from "@/types";

interface AICoachProps {
  stats: Stats;
  activeTasks: number;
  inProgress: number;
}

export function AICoach({ stats, activeTasks, inProgress }: AICoachProps) {
  const message = useMemo(() => {
    const { tasksCompletedToday, pomodorosCompletedToday, totalFocusMinutes } = stats;

    if (pomodorosCompletedToday >= 4) {
      return {
        icon: <Zap className="text-amber-400" size={18} />,
        title: "Süper odak!",
        text: `Bugün ${pomodorosCompletedToday} pomodoro ve ${totalFocusMinutes} dakika odak tamamladın. Harika gidiyorsun! 🔥`,
        tone: "success" as const,
      };
    }
    if (tasksCompletedToday >= 3) {
      return {
        icon: <TrendingUp className="text-emerald-400" size={18} />,
        title: "Verimli bir gün",
        text: `${tasksCompletedToday} görevi bitirdin. Momentum'unu koru, bir sonraki göreve geçebilirsin.`,
        tone: "success" as const,
      };
    }
    if (inProgress > 0 && pomodorosCompletedToday === 0) {
      return {
        icon: <Coffee className="text-[#00d2ff]" size={18} />,
        title: "Başlamak için hazır mısın?",
        text: "Devam eden görevin var. 25 dakikalık bir odak seansı ile hız kazanabilirsin.",
        tone: "info" as const,
      };
    }
    if (activeTasks > 5 && tasksCompletedToday === 0) {
      return {
        icon: <Sparkles className="text-violet-400" size={18} />,
        title: "Biraz yavaşladın",
        text: "Liste biraz kalabalık. En yüksek öncelikli 1 görevi seç ve kısa bir pomodoro başlat.",
        tone: "warn" as const,
      };
    }
    if (pomodorosCompletedToday >= 1) {
      return {
        icon: <TrendingUp className="text-[#00d2ff]" size={18} />,
        title: "İyi gidiyorsun",
        text: `${pomodorosCompletedToday} seans tamamlandı. Küçük molalar vererek devam et.`,
        tone: "info" as const,
      };
    }
    return {
      icon: <Sparkles className="text-[#00d2ff]" size={18} />,
      title: "Merhaba!",
      text: "Bugün harika işler çıkarabilirsin. İlk görevini ekle veya bir odak seansı başlat.",
      tone: "info" as const,
    };
  }, [stats, activeTasks, inProgress]);

  const borderColor =
    message.tone === "success"
      ? "border-emerald-500/30"
      : message.tone === "warn"
        ? "border-amber-500/30"
        : "border-[#00d2ff]/25";

  return (
    <div className={`glass p-4 border ${borderColor} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-800/60 shrink-0">{message.icon}</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-slate-100">{message.title}</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
              AI Koç
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{message.text}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900/50 rounded-lg py-2">
          <p className="text-lg font-semibold text-slate-100">{stats.tasksCompletedToday}</p>
          <p className="text-[10px] text-slate-500">Görev</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg py-2">
          <p className="text-lg font-semibold text-[#00d2ff]">{stats.pomodorosCompletedToday}</p>
          <p className="text-[10px] text-slate-500">Pomodoro</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg py-2">
          <p className="text-lg font-semibold text-emerald-400">{stats.totalFocusMinutes}</p>
          <p className="text-[10px] text-slate-500">Dakika</p>
        </div>
      </div>
    </div>
  );
}
