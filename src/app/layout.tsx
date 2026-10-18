import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SkillUp — твой следующий уровень", template: "%s | SkillUp" },
  description: "Развивай реальные навыки шаг за шагом. Начни свой путь со SkillUp.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
