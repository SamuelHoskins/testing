import { cookies } from "next/headers";
import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";

function ensureSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey } as const;
}

export function createSupabaseBrowserClient() {
  const { url, anonKey } = ensureSupabaseEnv();
  return createBrowserClient(url, anonKey);
}

export function createSupabaseServerClient() {
  const { url, anonKey } = ensureSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        const store = cookies() as unknown as {
          set?: (cookie: {
            name: string;
            value: string;
            path?: string;
            maxAge?: number;
            domain?: string;
            secure?: boolean;
            httpOnly?: boolean;
            sameSite?: "lax" | "strict" | "none";
          }) => void;
        };

        store.set?.({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        const store = cookies() as unknown as {
          set?: (cookie: {
            name: string;
            value: string;
            path?: string;
            maxAge?: number;
            domain?: string;
            secure?: boolean;
            httpOnly?: boolean;
            sameSite?: "lax" | "strict" | "none";
          }) => void;
        };

        store.set?.({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

export async function getSession() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;
export type SupabaseBrowserClient = ReturnType<typeof createSupabaseBrowserClient>;
