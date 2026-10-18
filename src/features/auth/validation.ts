import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Укажи корректный email").trim().max(254, "Email слишком длинный"),
  password: z.string().min(1, "Введи пароль").max(128, "Максимум 128 символов"),
});

export const registerSchema = loginSchema.extend({
  password: z.string().min(8, "Используй не менее 8 символов").max(128, "Максимум 128 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type AuthState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<"email" | "password" | "confirmPassword", string[]>>;
};
