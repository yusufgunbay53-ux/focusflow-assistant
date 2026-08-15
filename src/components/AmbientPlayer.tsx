"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, CloudRain, Music } from "lucide-react";

type SoundType = "rain" | "lofi" | "off";

export function AmbientPlayer() {
  const [sound, setSound] = useState<SoundType>("off");
  const [volume, setVolume] = useState(0.35);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    source?: AudioBufferSourceNode | OscillatorNode;
    gain?: GainNode;
    filter?: BiquadFilterNode;
    noiseBuffer?: AudioBuffer;
  }>({});

  const stopAll = () => {
    try {
      nodesRef.current.source?.stop();
    } catch {
      /* already stopped */
    }
    nodesRef.current = {};
  };

  const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const playRain = (ctx: AudioContext) => {
    stopAll();
    const buffer = nodesRef.current.noiseBuffer || createNoiseBuffer(ctx);
    nodesRef.current.noiseBuffer = buffer;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    gain.gain.value = volume * 0.4;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    nodesRef.current = { source, gain, filter, noiseBuffer: buffer };
  };

  const playLofi = (ctx: AudioContext) => {
    stopAll();
    const gain = ctx.createGain();
    gain.gain.value = volume * 0.12;

    const freqs = [110, 165, 220];
    const oscillators: OscillatorNode[] = [];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.3 - i * 0.08;
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      oscillators.push(osc);
    });

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    gain.connect(filter);
    filter.connect(ctx.destination);

    nodesRef.current = {
      source: oscillators[0],
      gain,
      filter,
    };
    (nodesRef.current as any).allOsc = oscillators;
  };

  useEffect(() => {
    return () => {
      stopAll();
      audioCtxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (sound === "off") {
      stopAll();
      return;
    }
    const start = async () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      if (sound === "rain") playRain(ctx);
      else if (sound === "lofi") playLofi(ctx);
    };
    start();
  }, [sound]);

  useEffect(() => {
    if (nodesRef.current.gain) {
      const base = sound === "rain" ? 0.4 : 0.12;
      nodesRef.current.gain.gain.value = volume * base;
    }
  }, [volume, sound]);

  const cycle = () => {
    setSound((prev) => {
      if (prev === "off") return "rain";
      if (prev === "rain") return "lofi";
      return "off";
    });
  };

  return (
    <div className="glass p-3 flex items-center gap-3">
      <button
        onClick={cycle}
        className={`p-2 rounded-lg transition-colors ${
          sound !== "off"
            ? "bg-[#00d2ff]/15 text-[#00d2ff]"
            : "text-slate-400 hover:text-slate-200"
        }`}
        title="Ses değiştir (Yağmur / Lo-Fi / Kapalı)"
      >
        {sound === "rain" ? (
          <CloudRain size={18} />
        ) : sound === "lofi" ? (
          <Music size={18} />
        ) : (
          <VolumeX size={18} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 truncate">
          {sound === "rain"
            ? "Yağmur Sesi"
            : sound === "lofi"
              ? "Lo-Fi Ambient"
              : "Ses kapalı"}
        </p>
        {sound !== "off" && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 mt-1 accent-[#00d2ff] cursor-pointer"
          />
        )}
      </div>

      {sound !== "off" && (
        <Volume2 size={14} className="text-slate-500 shrink-0" />
      )}
    </div>
  );
}
