"use client";

import { Focus } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-10 border-b border-white/5 bg-[#0b111e]/80 backdrop-blur-md sticky top-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d2ff]/30 to-[#00a8cc]/10 border border-[#00d2ff]/30 flex items-center justify-center">
            <Focus size={18} className="text-[#00d2ff]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100">
              Focus<span className="text-[#00d2ff]">Flow</span>
            </h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">AI Odaklanma Asistanı</p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          localStorage • PWA hazır
        </div>
      </div>
    </header>
  );
}
