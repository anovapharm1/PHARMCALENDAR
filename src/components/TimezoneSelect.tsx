"use client";

import { useBookingStore } from "@/store/bookingStore";

const TZ_DISPLAY: Record<string, string> = {
  "America/New_York": "Eastern Standard Time",
};

export default function TimezoneSelect() {
  const { timezone } = useBookingStore();
  const displayLabel = TZ_DISPLAY[timezone] || timezone.split("/").pop()?.replace(/_/g, " ") || timezone;

  return (
    <span className="text-sm text-[#94a3b8]">
      {displayLabel}
    </span>
  );
}
