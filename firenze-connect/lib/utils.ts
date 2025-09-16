import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuro(amount: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

export function formatAvailability(start: Date, end: Date) {
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return `${format(start, "d MMM, HH:mm")} – ${format(end, "HH:mm")}`;
  }

  return `${format(start, "d MMM HH:mm")} – ${format(end, "d MMM HH:mm")}`;
}
