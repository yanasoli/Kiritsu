import Link from "next/link";
import { ArrowUpRight, Check, Compass, Sparkles } from "lucide-react";
import { Brand } from "./brand";

export function AuthShell({ mode, children }: { mode: "register" | "login"; children: React.ReactNode }) {
  const registering = mode === "register";
  return <div className="site-shell">
    <header className="site-header">
      <Brand />
      <div className="header-action"><span>{registering ? "Уже с нами?" : "Пока нет аккаунта?"}</span>
        <Link href={registering ? "/login" : "/register"}>{registering ? "Войти" : "Регистрация"}<ArrowUpRight size={16} /></Link>
      </div>
    </header>
    <main className="auth-layout">
      <section className="intro" aria-labelledby="intro-title">
        <div className="eyebrow"><span className="status-dot" /> МАЛЕНЬКИЕ ШАГИ. РЕАЛЬНЫЙ РОСТ.</div>
        <h1 id="intro-title">Твой следующий<br />уровень<br /><span>начинается здесь.</span></h1>
        <p className="intro-copy">Преврати «хочу научиться» в свою новую историю.<br className="desktop-break" /> Один навык, один шаг, каждый день.</p>
        <div className="journey-art" aria-hidden="true">
          <div className="art-grid" />
          <span className="art-coordinate">ТВОЯ ТОЧКА РОСТА</span>
          <svg viewBox="0 0 480 250" className="journey-path">
            <path d="M-20 234 C65 234 36 148 141 148 S209 65 298 65 S380 20 490 20" fill="none" stroke="#b6d8cb" strokeWidth="2" strokeDasharray="5 7" />
            <path d="M-20 234 C65 234 36 148 141 148 S209 65 298 65" fill="none" stroke="#247659" strokeWidth="3" />
            <circle cx="141" cy="148" r="7" fill="#247659" stroke="#eef5ee" strokeWidth="5" />
            <circle cx="298" cy="65" r="9" fill="#247659" stroke="#d3e8b0" strokeWidth="5" />
            <circle cx="418" cy="28" r="6" fill="#f5f7ee" stroke="#b6d8cb" strokeWidth="2" />
          </svg>
          <div className="art-chip"><span className="art-chip-icon"><Compass size={20} /></span><div><small>БОЛЬШОЕ ПУТЕШЕСТВИЕ</small><strong>Начинается с первого шага</strong></div><ArrowUpRight size={17} /></div>
          <div className="growth-badge"><Sparkles size={15} /> Место для твоего роста</div>
          <span className="art-caption">НАВЫКИ В РЕАЛЬНОЙ ЖИЗНИ. ПОДХОД ИЗ ИГР.</span>
        </div>
        <div className="intro-note"><span><Check size={14} /></span> Твой темп. Твои цели. Твой путь.</div>
      </section>
      <section className="form-area" aria-label={registering ? "Регистрация" : "Вход"}>{children}</section>
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} SkillUp</span><span>Развивай навыки. Открывай возможности.<ArrowUpRight size={13} /></span></footer>
  </div>;
}
