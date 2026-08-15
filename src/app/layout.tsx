import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow — AI Destekli Görev & Odaklanma Asistanı",
  description:
    "Modern dark mode görev yönetimi, Kanban board, Pomodoro timer, Lo-Fi müzik ve AI performans koçu.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FocusFlow",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b111e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
