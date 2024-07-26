import { createBrowserClient } from "@supabase/ssr";
import {NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL} from "@/constants";

export const createClient = () =>
  createBrowserClient(
 NEXT_PUBLIC_SUPABASE_URL!,
NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const supabase = createClient()
