const TIMEZONES = Intl.supportedValuesOf
  ? Intl.supportedValuesOf("timeZone")
  : [
      "UTC",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Amsterdam",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Kolkata",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

export { TIMEZONES };

const BLOCKED_SLOTS: Record<string, string[]> = {
  "0": ["09:00", "10:30", "14:00", "19:00"],
  "1": ["11:00", "15:30", "20:00"],
  "2": ["13:00", "16:30", "18:30"],
  "3": ["10:00", "14:30", "21:00"],
  "4": ["09:30", "12:00", "15:00", "19:30"],
};

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getRandomBlockedSlots(date: Date): string[] {
  const dayIndex = date.getDate() % 5;
  return BLOCKED_SLOTS[String(dayIndex)] || [];
}

export function generateAvailableSlots(date: Date): string[] {
  if (isWeekend(date)) return [];

  const allSlots: string[] = [];
  for (let h = 9; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      allSlots.push(`${hour}:${minute}`);
    }
  }

  const blocked = getRandomBlockedSlots(date);
  return allSlots.filter((slot) => !blocked.includes(slot));
}

export function isDayFullyBooked(date: Date): boolean {
  return generateAvailableSlots(date).length === 0;
}

export function getNextAvailableDate(from: Date, maxDays: number = 60): Date | null {
  const current = new Date(from);
  for (let i = 0; i < maxDays; i++) {
    current.setDate(current.getDate() + 1);
    if (!isWeekend(current) && !isDayFullyBooked(current)) {
      return new Date(current);
    }
  }
  return null;
}
