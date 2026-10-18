import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/features/auth/auth-form";
import { getCurrentUser } from "@/features/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Вход" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { error } = await searchParams;
  return <AuthShell mode="login"><AuthForm mode="login" confirmationError={error === "confirmation"} /></AuthShell>;
}
