"use client";

import { CalendarDays, Columns3 } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { cn } from "@/lib/utils";

export default function ViewToggle() {
  const { use24h, toggle24h, viewMode, setViewMode } = useBookingStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border border-[#e2e8f0] rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => setViewMode("day")}
          className={cn(
            "p-1.5 transition-colors",
            viewMode === "day"
              ? "bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] text-white"
              : "text-[#94a3b8] hover:text-[#64748b]"
          )}
        >
          <CalendarDays className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={cn(
            "p-1.5 transition-colors",
            viewMode === "week"
              ? "bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] text-white"
              : "text-[#94a3b8] hover:text-[#64748b]"
          )}
        >
          <Columns3 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center border border-[#e2e8f0] rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => !use24h && toggle24h()}
          className={cn(
            "px-2.5 py-1 text-xs font-medium transition-colors",
            !use24h
              ? "bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] text-white"
              : "text-[#94a3b8] hover:text-[#64748b]"
          )}
        >
          12h
        </button>
        <button
          onClick={() => use24h && toggle24h()}
          className={cn(
            "px-2.5 py-1 text-xs font-medium transition-colors",
            use24h
              ? "bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] text-white"
              : "text-[#94a3b8] hover:text-[#64748b]"
          )}
        >
          24h
        </button>
      </div>
    </div>
  );
}
