"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, LoaderCircle, CheckCircle2 } from "lucide-react";
import { authenticate } from "./actions";
import { loginSchema, registerSchema, type AuthState } from "./validation";

const initialState: AuthState = { status: "idle" };

export function AuthForm({ mode, confirmationError = false }: { mode: "register" | "login"; confirmationError?: boolean }) {
  const registering = mode === "register";
  const [state, action, pending] = useActionState(authenticate.bind(null, mode), initialState);
  const [clientErrors, setClientErrors] = useState<AuthState["errors"]>();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(0);
  const errors = clientErrors ?? state.errors;

  return <div className="auth-card">
    <div className="card-kicker"><span>{registering ? "01" : "↗"}</span>{registering ? "ТВОЙ ПЕРВЫЙ ШАГ" : "ПРОДОЛЖАЕМ ПУТЬ"}</div>
    <h2>{registering ? "Начни свою историю" : "С возвращением"}</h2>
    <p className="card-description">{registering ? "Создай аккаунт. Всё большое начинается с малого." : "Войди в аккаунт и продолжи двигаться вперёд."}</p>
    {confirmationError && <p className="form-notice error" role="alert">Ссылка подтверждения недействительна или устарела. Попробуй войти, если почта уже подтверждена. Иначе повтори регистрацию для нового письма.</p>}
    <form action={action} noValidate onSubmit={(event) => {
      const form = new FormData(event.currentTarget);
      const result = (registering ? registerSchema : loginSchema).safeParse({
        email: String(form.get("email") ?? "").trim(),
        password: form.get("password"),
        confirmPassword: form.get("confirmPassword"),
      });
      if (!result.success) {
        event.preventDefault();
        setClientErrors(result.error.flatten().fieldErrors);
        const field = result.error.issues[0]?.path[0];
        if (typeof field === "string") (event.currentTarget.elements.namedItem(field) as HTMLInputElement | null)?.focus();
      } else setClientErrors(undefined);
    }}>
      <div className="field-group">
        <label htmlFor="email">Электронная почта</label>
        <div className={`input-wrap ${errors?.email ? "invalid" : ""}`}><Mail size={18} />
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required disabled={pending} aria-invalid={Boolean(errors?.email)} aria-describedby={errors?.email ? "email-error" : undefined} />
        </div>
        {errors?.email && <p className="field-error" id="email-error">{errors.email[0]}</p>}
      </div>
      <div className="field-group">
        <label htmlFor="password">Пароль</label>
        <div className={`input-wrap ${errors?.password ? "invalid" : ""}`}><LockKeyhole size={18} />
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} placeholder={registering ? "Не менее 8 символов" : "Твой пароль"} minLength={registering ? 8 : 1} maxLength={128} required disabled={pending} onChange={(event) => setPasswordLength(event.target.value.length)} aria-invalid={Boolean(errors?.password)} aria-describedby={errors?.password ? "password-error" : registering ? "password-hint" : undefined} />
          <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        {errors?.password && <p className="field-error" id="password-error">{errors.password[0]}</p>}
        {registering && <div className="password-hint" id="password-hint"><div className="password-meter" aria-hidden="true"><i className={passwordLength >= 1 ? "filled" : ""} /><i className={passwordLength >= 8 ? "filled" : ""} /><i className={passwordLength >= 12 ? "filled" : ""} /></div><span>Лучше длиннее: от 8 символов</span></div>}
      </div>
      {registering && <div className="field-group">
        <label htmlFor="confirmPassword">Повтори пароль</label>
        <div className={`input-wrap ${errors?.confirmPassword ? "invalid" : ""}`}><LockKeyhole size={18} />
          <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Ещё раз, чтобы без ошибок" maxLength={128} required disabled={pending} aria-invalid={Boolean(errors?.confirmPassword)} aria-describedby={errors?.confirmPassword ? "confirm-error" : undefined} />
        </div>
        {errors?.confirmPassword && <p className="field-error" id="confirm-error">{errors.confirmPassword[0]}</p>}
      </div>}
      {state.message && <p className={`form-notice ${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.status === "success" && <CheckCircle2 size={18} />}{state.message}</p>}
      <button className="primary-button" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="spinner" size={19} />{registering ? "Создаём аккаунт…" : "Входим…"}</> : <>{registering ? "Создать аккаунт" : "Войти"}<ArrowRight size={18} /></>}</button>
    </form>
    <div className="secure-note"><LockKeyhole size={13} /> Пароль защищён. Твой путь принадлежит тебе.</div>
    <div className="card-bottom">{registering ? "Уже есть аккаунт?" : "Впервые здесь?"} <Link href={registering ? "/login" : "/register"}>{registering ? "Войти" : "Создать аккаунт"}<ArrowUpRightSmall /></Link></div>
  </div>;
}

function ArrowUpRightSmall() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>;
}
