import type { Metadata } from "next";
import Link from "next/link";

import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requestSignInMagicLink } from "@/app/(auth)/actions";

export const metadata: Metadata = {
  title: "Sign in | Firenze Connect",
  description: "Sign in with a secure email magic link to access your Firenze Connect dashboard.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary/30 px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Bentornato</CardTitle>
          <p className="text-sm text-muted-foreground">
            Access your dashboard with a one-time magic link.
          </p>
        </CardHeader>
        <CardContent>
          <MagicLinkForm
            action={requestSignInMagicLink}
            title="Sign in"
            subtitle="We will send you a secure, one-time sign-in link"
            submitLabel="Send me a magic link"
          />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Firenze Connect?{" "}
            <Link href="/sign-up" className="font-medium text-primary">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
