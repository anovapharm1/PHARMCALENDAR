"use client";

import { motion } from "framer-motion";
import { CheckCircle, Video, Globe, Lock } from "lucide-react";
import { useBookingStore, type Duration } from "@/store/bookingStore";
import { cn } from "@/lib/utils";
import TimezoneSelect from "./TimezoneSelect";
import CaduceusLogo from "./CaduceusLogo";

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
    <aside className="w-full lg:w-[360px] lg:min-w-[360px] p-4 lg:p-6">
      <div className="bg-gradient-to-b from-[#fafbfd] to-[#f5f7fb] rounded-2xl h-full flex flex-col gap-6 relative border border-[rgba(0,0,0,0.04)]">
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.04)] to-transparent" />

        <div className="p-6 pb-0 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <CaduceusLogo size={56} />
            <div>
              <span className="text-base font-bold text-[#1e293b] block leading-tight">
                Peer Richelson
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#1e40af]" />
                <span className="text-xs text-[#1e40af] font-medium">Verified Host</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] font-bold text-[#1e293b] leading-tight font-serif tracking-tight">
              30 Minutes
            </h1>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              <strong className="text-[#64748b]">Let&apos;s connect</strong> and
              discuss how we can support your medical practice. No prep
              needed — bring your questions and goals.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-[#94a3b8] tracking-[0.12em] uppercase block">
              Duration
            </span>
            <div className="flex gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "flex-1 px-3 py-2.5 text-sm rounded-xl font-medium transition-all duration-200",
                    duration === d
                      ? "bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] text-white shadow-md"
                      : "bg-transparent border border-[#e2e8f0] text-[#94a3b8] hover:border-[#cbd5e1] hover:text-[#64748b]"
                  )}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2.5 text-sm text-[#94a3b8]">
              <CheckCircle className="w-4 h-4 text-[#cbd5e1]" />
              <span>Requires confirmation</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#94a3b8]">
              <Video className="w-4 h-4 text-[#cbd5e1]" />
              <span>Cal Video</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#94a3b8]">
              <Globe className="w-4 h-4 text-[#cbd5e1]" />
              <TimezoneSelect />
            </div>
          </div>
        </div>

        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 p-3 rounded-xl bg-[rgba(30,64,175,0.06)] border border-[rgba(30,64,175,0.1)]"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1e40af]" />
              <span className="text-sm text-[#1e293b] font-medium">
                {dateStr} &middot; {selectedTime}
              </span>
            </div>
          </motion.div>
        )}

        <div className="mt-auto flex items-center gap-2 px-6 pb-6 pt-4 border-t border-[rgba(0,0,0,0.04)]">
          <Lock className="w-3.5 h-3.5 text-[#1e40af]/60" />
          <span className="text-xs text-[#94a3b8]">End-to-end encrypted</span>
        </div>
      </div>
    </aside>
  );
}
