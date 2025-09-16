"use client";

import { useFormState } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type MagicLinkStatus = "idle" | "success" | "error";

export type MagicLinkState = {
  status: MagicLinkStatus;
  message?: string;
};

const initialState: MagicLinkState = { status: "idle" };

export type MagicLinkFormAction = (
  state: MagicLinkState,
  formData: FormData,
) => Promise<MagicLinkState>;

interface MagicLinkFormProps {
  action: MagicLinkFormAction;
  title: string;
  subtitle?: string;
  submitLabel?: string;
  className?: string;
}

export function MagicLinkForm({
  action,
  title,
  subtitle,
  submitLabel = "Send magic link",
  className,
}: MagicLinkFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className={cn("grid gap-6", className)} noValidate>
      <div className="grid gap-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="grid gap-2 text-left">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          required
        />
      </div>
      {state.status !== "idle" && state.message ? (
        <p
          className={cn(
            "rounded-md border px-3 py-2 text-sm",
            state.status === "success"
              ? "border-green-400 bg-green-50 text-green-700"
              : "border-destructive/60 bg-destructive/10 text-destructive",
          )}
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
