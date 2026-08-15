# FocusFlow — AI Destekli Görev & Odaklanma Asistanı

Modern, karanlık temalı, mobil uyumlu bir odaklanma ve görev yönetim uygulaması.

![FocusFlow](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square)

## Özellikler

- **Kanban Board** — Sürükle-bırak ile Yapılacaklar / Yapılıyor / Tamamlandı
- **Öncelik etiketleri** — Düşük, Orta, Yüksek
- **Pomodoro sayacı** — 25 dk odak + 5 dk mola, bildirim + ses uyarısı
- **Ambient ses** — Yağmur / Lo-Fi ambient (Web Audio)
- **AI Performans Koçu** — Günlük istatistiklere göre akıllı geri bildirim (mock, API’ye hazır)
- **localStorage** — Veriler tarayıcıda kalıcı
- **Glassmorphism + Neon mavi** dark UI
- **PWA hazır** viewport & meta

## Teknoloji

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Lucide React
- @dnd-kit (drag & drop)
- TypeScript

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Veri modeli (Supabase / Firebase’e geçiş için hazır)

```ts
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdAt: number;
  completedAt?: number;
  order: number;
}
```

Tüm state `src/hooks/useAppData.ts` içinde toplanmıştır; backend eklerken bu hook’u API çağrılarıyla değiştirmeniz yeterli.

## Lisans

MIT
