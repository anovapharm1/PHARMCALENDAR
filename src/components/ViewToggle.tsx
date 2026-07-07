"use client";

import { CalendarDays, Columns3 } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { cn } from "@/lib/utils";

export default function ViewToggle() {
  const { use24h, toggle24h, viewMode, setViewMode } = useBookingStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => setViewMode("day")}
          className={cn(
            "p-1.5 transition-colors",
            viewMode === "day"
              ? "bg-white/10 text-primary"
              : "text-muted hover:text-secondary"
          )}
        >
          <CalendarDays className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={cn(
            "p-1.5 transition-colors",
            viewMode === "week"
              ? "bg-white/10 text-primary"
              : "text-muted hover:text-secondary"
          )}
        >
          <Columns3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center border border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => !use24h && toggle24h()}
          className={cn(
            "px-2.5 py-1 text-xs font-medium transition-colors",
            !use24h ? "bg-white/10 text-primary" : "text-muted hover:text-secondary"
          )}
        >
          12h
        </button>
        <button
          onClick={() => use24h && toggle24h()}
          className={cn(
            "px-2.5 py-1 text-xs font-medium transition-colors",
            use24h ? "bg-white/10 text-primary" : "text-muted hover:text-secondary"
          )}
        >
          24h
        </button>
      </div>
    </div>
  );
}
