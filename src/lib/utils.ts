export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(time: string, use24h: boolean): string {
  if (use24h) {
    const [h, m] = time.split(":");
    return `${h}:${m}`;
  }
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")}${period}`;
}

export function parseTimeDisplay(timeStr: string): { hour: number; minute: number } {
  const isPM = timeStr.includes("pm");
  const isAM = timeStr.includes("am");
  const cleaned = timeStr.replace(/(am|pm)/, "");
  const parts = cleaned.split(":").map(Number);
  let hour = parts[0];
  const minute = parts[1] || 0;
  if (isPM && hour !== 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return { hour, minute };
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
