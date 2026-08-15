# FocusFlow — AI Destekli Görev & Odaklanma Asistanı

Modern, karanlık temalı, kullanıcı dostu bir web uygulaması. Görev yönetimi (Kanban), Pomodoro sayacı, ambient sesler ve AI performans koçu bir arada.

## Özellikler

### Akıllı Görev Yönetimi
- Görev ekleme, düzenleme, silme
- Öncelik etiketleri (Düşük / Orta / Yüksek)
- Sürükle-bırak Kanban board: Yapılacaklar → Yapılıyor → Tamamlandı
- Tamamlanan görevlerde check işareti

### Gelişmiş Pomodoro
- 25 dk çalışma + 5 dk mola
- Dairesel ilerleme göstergesi
- Süre bitince tarayıcı bildirimi + sesli uyarı
- Çalışma / Mola modları arasında geçiş

### Ambient Ses Çalar
- Yağmur sesi
- Lo-Fi müzik
- Ses seviyesi kontrolü

### AI Performans Koçu
- Görev tamamlama ve Pomodoro verilerine göre akıllı geri bildirim
- Günlük istatistikler (görev, pomodoro, odak dakikası)
- Mock AI — ileride gerçek API’ye kolayca bağlanabilir

### Veri Saklama
- Tüm veriler localStorage üzerinde
- Sayfa yenilense bile görevler ve istatistikler korunur
- JSON modelleri Supabase / Firebase’e taşımaya hazır

## Tasarım
- Tam karanlık mod
- Neon mavi (#00d2ff) + derin gece mavisi (#0b111e)
- Glassmorphism kartlar
- Yumuşak hover efektleri
- Mobil uyumlu (PWA manifest dahil)

## Teknoloji
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (ikonlar)
- @dnd-kit (sürükle-bırak)

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda: http://localhost:3000

## Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── KanbanBoard.tsx
│   ├── TaskCard.tsx
│   ├── PomodoroTimer.tsx
│   ├── AmbientPlayer.tsx
│   └── AICoach.tsx
├── lib/
│   ├── storage.ts
│   └── ai-coach.ts
└── types/
    └── index.ts
```

Geliştirici: FocusFlow · Grok ile hazırlanmıştır
