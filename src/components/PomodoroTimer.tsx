"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

interface PomodoroTimerProps {
  onSessionComplete: (type: "work" | "break", duration: number) => void;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const progress = 1 - secondsLeft / totalSeconds;

  const playNotification = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 680;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // ignore
    }
  }, []);

  const requestNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined") return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((p) => {
        if (p === "granted") new Notification(title, { body, icon: "/favicon.ico" });
      });
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          playNotification();
          const completedType = mode;
          const duration = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
          onSessionComplete(completedType, duration);

          if (mode === "work") {
            requestNotification("Odak süresi bitti! 🎉", "5 dakikalık mola zamanı.");
            setMode("break");
            setSecondsLeft(BREAK_SECONDS);
          } else {
            requestNotification("Mola bitti!", "Yeni bir odak seansına hazır mısın?");
            setMode("work");
            setSecondsLeft(WORK_SECONDS);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, onSessionComplete, playNotification, requestNotification]);

  const toggle = () => setIsRunning((v) => !v);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const switchMode = (m: "work" | "break") => {
    setIsRunning(false);
    setMode(m);
    setSecondsLeft(m === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const size = 180;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="glass p-5 flex flex-col items-center">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchMode("work")}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all ${
            mode === "work"
              ? "bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40"
              : "text-slate-400 border border-transparent hover:text-slate-200"
          }`}
        >
          <Brain size={14} /> Odak
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all ${
            mode === "break"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "text-slate-400 border border-transparent hover:text-slate-200"
          }`}
        >
          <Coffee size={14} /> Mola
        </button>
      </div>

      <div className="relative mb-5">
        <svg width={size} height={size} className="block">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={mode === "work" ? "#00d2ff" : "#34d399"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-semibold tracking-tight text-slate-100">
            {timeStr}
          </span>
          <span className="text-xs text-slate-500 mt-1">
            {mode === "work" ? "Odaklan" : "Dinlen"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="p-2.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          aria-label="Sıfırla"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={toggle}
          className={`p-3.5 rounded-full btn-neon ${isRunning ? "animate-pulse-neon" : ""}`}
          aria-label={isRunning ? "Duraklat" : "Başlat"}
        >
          {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
