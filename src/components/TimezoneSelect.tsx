"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { TIMEZONES } from "@/lib/availability";
import { cn } from "@/lib/utils";

export default function TimezoneSelect() {
  const { timezone, setTimezone } = useBookingStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shortTz = timezone.split("/").pop()?.replace(/_/g, " ") || timezone;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-secondary hover:text-primary transition-colors"
      >
        <span>{shortTz}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-56 max-h-48 overflow-y-auto bg-card border border-subtle rounded-lg shadow-2xl">
          {TIMEZONES.map((tz) => (
            <button
              key={tz}
              onClick={() => {
                setTimezone(tz);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                tz === timezone
                  ? "text-primary bg-white/10"
                  : "text-secondary hover:bg-hover hover:text-primary"
              )}
            >
              {tz}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
