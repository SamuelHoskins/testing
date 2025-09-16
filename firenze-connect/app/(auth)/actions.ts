"use server";

import { z } from "zod";

import { MagicLinkState } from "@/components/auth/magic-link-form";
import { createSupabaseServerClient } from "@/lib/auth";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function sendMagicLink(
  _prevState: MagicLinkState,
  formData: FormData,
  shouldCreateUser: boolean,
  purpose: "sign-in" | "sign-up",
): Promise<MagicLinkState> {
  const email = formData.get("email");
  const parsed = emailSchema.safeParse({ email });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid email",
    };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser,
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        purpose,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  return {
    status: "success",
    message: `A magic link has been sent to ${parsed.data.email}. Check your inbox to continue.`,
  };
}

export function requestSignInMagicLink(prevState: MagicLinkState, formData: FormData) {
  return sendMagicLink(prevState, formData, false, "sign-in");
}

export function requestSignUpMagicLink(prevState: MagicLinkState, formData: FormData) {
  return sendMagicLink(prevState, formData, true, "sign-up");
}
