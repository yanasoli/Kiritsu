"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { loginSchema, registerSchema, type AuthState } from "./validation";

export async function authenticate(mode: "register" | "login", _previous: AuthState, form: FormData): Promise<AuthState> {
  // Treat Server Action arguments as untrusted, even when bound by our component.
  if (mode !== "register" && mode !== "login") {
    return { status: "error", message: "Неизвестное действие." };
  }
  const parsed = (mode === "register" ? registerSchema : loginSchema).safeParse({
    email: typeof form.get("email") === "string" ? String(form.get("email")).trim() : "",
    password: form.get("password"),
    confirmPassword: form.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Проверь данные в форме.", errors: parsed.error.flatten().fieldErrors };
  }
  if (!getSupabaseConfig()) {
    return { status: "error", message: "Supabase ещё не подключён. Добавь URL проекта и Publishable key в .env.local и перезапусти приложение." };
  }

  let signedIn = false;
  try {
    const supabase = await createClient();
    if (mode === "register") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (!siteUrl) return { status: "error", message: "Укажи NEXT_PUBLIC_SITE_URL в .env.local." };
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: new URL("/auth/confirm", siteUrl).toString() },
      });
      if (error) {
        return { status: "error", message: error.status === 429
          ? "Слишком много попыток. Подожди немного и попробуй снова."
          : "Не удалось создать аккаунт. Проверь данные или попробуй войти. Если ошибка повторяется, попробуй позже." };
      }
      signedIn = Boolean(data.session);
      if (!signedIn) return {
        status: "success",
        message: "Если адрес доступен для регистрации, на него придёт письмо. Подтверди email по ссылке, чтобы войти. Если аккаунт уже есть — перейди ко входу.",
      };
    } else {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) return { status: "error", message: error.status === 429
        ? "Слишком много попыток. Попробуй чуть позже."
        : "Не удалось войти. Проверь email, пароль и подтверждение почты." };
      signedIn = true;
    }
  } catch {
    return { status: "error", message: "Не удалось связаться с сервисом. Проверь подключение и настройки Supabase." };
  }
  // redirect throws internally, so it must stay outside the catch block.
  if (signedIn) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }
  return { status: "error", message: "Попробуй ещё раз." };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) redirect("/dashboard?error=signout");
  revalidatePath("/", "layout");
  redirect("/login");
}
