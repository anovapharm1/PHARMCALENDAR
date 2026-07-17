"use client";

import { motion } from "framer-motion";
import { Clock, Video, Globe, CheckCircle, Lock, ShieldCheck } from "lucide-react";
import { useBookingStore, type Duration } from "@/store/bookingStore";
import { cn } from "@/lib/utils";
import TimezoneSelect from "./TimezoneSelect";

const durations: Duration[] = [15, 30, 45];

export default function HostProfile() {
  const { duration, setDuration, selectedDate, selectedTime } =
    useBookingStore();

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <aside className="w-full lg:w-[320px] lg:min-w-[320px] lg:border-r border-subtle p-4 lg:p-6">
      <div className="bg-[#FAF6F1] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-7 flex flex-col gap-6 border border-[rgba(255,255,255,0.06)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.4)] to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4654A] to-[#E8A87C] flex items-center justify-center text-lg font-bold text-white shadow-lg">
              PR
            </div>
            <div className="absolute -inset-1 rounded-full border-2 border-[#C9A94E]/50" />
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#C9A94E] rounded-full flex items-center justify-center shadow-sm border-2 border-[#FAF6F1]">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-[#3D405B]">
                Peer Richelsen
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-3 h-3 text-[#D4654A]" />
              <span className="text-xs text-[#D4654A] font-medium">Verified Host</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 relative">
          <h1 className="text-[28px] font-bold tracking-tight text-[#3D405B] leading-tight">
            {duration} Minutes
          </h1>
          <p className="text-sm text-[rgba(61,64,91,0.65)] leading-relaxed">
            Peer is looking forward to your conversation. No prep needed —
            just bring your ideas and questions.
          </p>
        </div>

        <div className="flex gap-2 relative">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                "px-4 py-2.5 text-sm rounded-xl font-medium transition-all duration-200",
                duration === d
                  ? "bg-[#D4654A] text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] scale-[1.02]"
                  : "bg-transparent border border-[rgba(61,64,91,0.15)] text-[rgba(61,64,91,0.6)] hover:bg-[rgba(212,101,74,0.08)] hover:text-[#D4654A] hover:border-[#D4654A]/30"
              )}
            >
              {d} min
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-1 relative">
          <div className="flex items-center gap-2.5 text-sm text-[rgba(61,64,91,0.6)]">
            <CheckCircle className="w-4 h-4 text-[#D4654A]/60" />
            <span>Requires confirmation</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-[rgba(61,64,91,0.6)]">
            <Video className="w-4 h-4 text-[#D4654A]/60" />
            <span>Cal Video</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-[rgba(61,64,91,0.6)]">
            <Globe className="w-4 h-4 text-[#D4654A]/60" />
            <TimezoneSelect />
          </div>
        </div>

        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-[rgba(212,101,74,0.08)] border border-[rgba(212,101,74,0.15)] relative"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4654A]" />
              <span className="text-sm text-[#3D405B] font-medium">
                {dateStr} &middot; {selectedTime}
              </span>
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-[rgba(61,64,91,0.1)] relative">
          <Lock className="w-3.5 h-3.5 text-[rgba(61,64,91,0.4)]" />
          <span className="text-xs text-[rgba(61,64,91,0.45)]">End-to-end encrypted</span>
        </div>
      </div>
    </aside>
  );
}
