import type { Metadata } from "next";
import Link from "next/link";

import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requestSignUpMagicLink } from "@/app/(auth)/actions";

export const metadata: Metadata = {
  title: "Join Firenze Connect",
  description:
    "Apply to join Florence's creative marketplace and collaborate with top artists, models, and brands.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary/30 px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Join the collective</CardTitle>
          <p className="text-sm text-muted-foreground">
            Request an invite and we&apos;ll send you a secure magic link to get started.
          </p>
        </CardHeader>
        <CardContent>
          <MagicLinkForm
            action={requestSignUpMagicLink}
            title="Request access"
            subtitle="Use your best professional email so agencies can reach you quickly"
            submitLabel="Email me the invite"
          />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already received an invite?{" "}
            <Link href="/sign-in" className="font-medium text-primary">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
