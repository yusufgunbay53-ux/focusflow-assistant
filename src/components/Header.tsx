"use client";

import { Focus, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Focus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Focus<span className="text-cyan-400">Flow</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Destekli Görev & Odaklanma Asistanı
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-cyan-400/80 text-sm">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Grok Powered</span>
        </div>
      </div>
    </header>
  );
}
