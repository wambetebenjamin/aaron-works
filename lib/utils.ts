export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatKES(amount: number, compact = false) {
  if (compact && amount >= 1000) {
    const value = amount / 1000;
    return `KES ${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatBudget(min: number, max: number, type: "fixed" | "hourly") {
  if (type === "hourly") {
    return min === max
      ? `${formatKES(min)}/hr`
      : `${formatKES(min)} – ${formatKES(max)}/hr`;
  }
  return min === max ? formatKES(min) : `${formatKES(min)} – ${formatKES(max)}`;
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available now",
  limited: "Limited availability",
  busy: "Fully booked",
};

export function whatsappLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function postedWithinDays(daysAgo: number, filter: string) {
  if (!filter || filter === "any") return true;
  const map: Record<string, number> = { today: 1, week: 7, month: 30 };
  const limit = map[filter];
  if (!limit) return true;
  return daysAgo <= limit;
}

export function truncate(value: string, length: number) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}
