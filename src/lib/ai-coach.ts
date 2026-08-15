import { Task, Stats, PomodoroSession } from "@/types";

export interface CoachMessage {
  id: string;
  text: string;
  type: "encourage" | "suggest" | "celebrate" | "neutral";
  timestamp: number;
}

const ENCOURAGE = [
  "Bugün harika gidiyorsun! 💪",
  "Odaklanman gerçekten etkileyici!",
  "Her tamamlanan görev seni hedefe yaklaştırıyor.",
  "Devam et, momentum yakaladın!",
  "Harika bir ritim tutturmuşsun.",
];

const SUGGEST = [
  "Biraz yavaşladın, 5 dakika mola vermek ister misin?",
  "Belki bir Pomodoro daha yapmak iyi gelir?",
  "Yüksek öncelikli görevlere odaklanmayı dene.",
  "Kısa bir yürüyüş veya esneme hareketi iyi gelebilir.",
  "Görevleri küçük parçalara bölmek yardımcı olabilir.",
];

const CELEBRATE = [
  "Muhteşem! Bugün birçok görevi tamamladın! 🎉",
  "Pomodoro rekoru kırıyorsun, tebrikler!",
  "Süper performans! Kendine bir ödül hak ettin.",
  "Bugün gerçekten üretken bir gündü!",
];

export function generateCoachMessage(
  tasks: Task[],
  stats: Stats,
  recentSessions: PomodoroSession[]
): CoachMessage {
  const completedToday = tasks.filter(
    (t) =>
      t.status === "done" &&
      t.completedAt &&
      new Date(t.completedAt).toISOString().slice(0, 10) ===
        new Date().toISOString().slice(0, 10)
  ).length;

  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const highPriorityPending = tasks.filter(
    (t) => t.priority === "high" && t.status !== "done"
  ).length;

  const focusMinutes = stats.totalFocusMinutesToday;
  const pomodoros = stats.pomodorosCompletedToday;

  let type: CoachMessage["type"] = "neutral";
  let text = "Odaklanmaya hazır mısın? Hadi başlayalım!";

  if (completedToday >= 5 || pomodoros >= 4) {
    type = "celebrate";
    text = CELEBRATE[Math.floor(Math.random() * CELEBRATE.length)];
  } else if (completedToday >= 2 || focusMinutes >= 50) {
    type = "encourage";
    text = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];
  } else if (inProgress === 0 && highPriorityPending > 0) {
    type = "suggest";
    text = "Yüksek öncelikli görevlerin var. Bir tanesini 'Yapılıyor'a taşımayı dene.";
  } else if (focusMinutes < 25 && completedToday === 0) {
    type = "suggest";
    text = SUGGEST[Math.floor(Math.random() * SUGGEST.length)];
  } else if (pomodoros === 0 && completedToday > 0) {
    type = "suggest";
    text = "Görevleri bitirdin ama Pomodoro henüz kullanmadın. Denemek ister misin?";
  } else {
    type = "encourage";
    text = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];
  }

  return {
    id: `msg-${Date.now()}`,
    text,
    type,
    timestamp: Date.now(),
  };
}
