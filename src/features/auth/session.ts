import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function getCurrentUser() {
  if (!getSupabaseConfig()) return null;
  const supabase = await createClient();
  // getUser also checks the current user record with the Auth server.
  const { data: { user }, error } = await supabase.auth.getUser();
  return error ? null : user;
}
