import { redirect } from "next/navigation";
import { ArrowUpRight, Check, LogOut, Sprout } from "lucide-react";
import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/features/auth/session";
import { signOut } from "@/features/auth/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Твой профиль" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { error } = await searchParams;
  return <div className="site-shell dashboard-shell">
    <header className="site-header"><Brand /><form action={signOut}><button className="logout-button" type="submit">Выйти<LogOut size={16} /></button></form></header>
    <main className="welcome-card">
      <span className="welcome-icon"><Sprout size={32} /></span>
      <div className="eyebrow">ПЕРВЫЙ ШАГ СДЕЛАН</div>
      <h1>Добро пожаловать<br />в <span>SkillUp.</span></h1>
      <p>Твоя история развития начинается здесь.</p>
      <div className="account-detail"><span className="account-avatar">{(user.email?.[0] ?? "S").toUpperCase()}</span><div><small>ТВОЙ АККАУНТ</small><strong>{user.email}</strong></div><Check size={18} /></div>
      <div className="welcome-next"><ArrowUpRight size={20} /><p>Аккаунт создан и вход выполнен.<br /><span>На следующем этапе добавим выбор первого навыка.</span></p></div>
      {error === "signout" && <p className="form-notice error" role="alert">Не удалось завершить сессию. Попробуй выйти ещё раз.</p>}
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} SkillUp</span><span>Большой путь начинается с малого.</span></footer>
  </div>;
}
