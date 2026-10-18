import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const code = request.nextUrl.searchParams.get("code");
  if (getSupabaseConfig() && (tokenHash || code)) {
    try {
      const supabase = await createClient();
      // Fixed type and redirect prevent arbitrary OTP flows or open redirects.
      const { error } = tokenHash
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" })
        : await supabase.auth.exchangeCodeForSession(code!);
      if (!error) return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      // Invalid/expired links and unavailable Auth service use the same safe path.
    }
  }
  return NextResponse.redirect(new URL("/login?error=confirmation", request.url));
}
