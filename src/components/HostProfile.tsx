"use client";

import { motion } from "framer-motion";
import { Clock, Video, Globe, CheckCircle } from "lucide-react";
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
    <aside className="w-full lg:w-[320px] lg:min-w-[320px] lg:border-r border-subtle p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-primary">
          PR
        </div>
        <span className="text-sm font-semibold text-primary">
          Peer Richelsen
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {duration} Minutes
        </h1>
        <p className="text-sm text-secondary leading-relaxed">
          Let&apos;s connect and discuss how we can work together. No prep
          needed — just bring your ideas and questions.
        </p>
      </div>

      <div className="flex gap-2">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => setDuration(d)}
            className={cn(
              "px-4 py-2 text-sm rounded-lg font-medium transition-all duration-150",
              duration === d
                ? "bg-active text-inverse"
                : "bg-transparent border border-subtle text-secondary hover:bg-hover"
            )}
          >
            {d} min
          </button>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2.5 text-sm text-secondary">
          <CheckCircle className="w-4 h-4 text-secondary" />
          <span>Requires confirmation</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-secondary">
          <Video className="w-4 h-4 text-secondary" />
          <span>Cal Video</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-secondary">
          <Globe className="w-4 h-4 text-secondary" />
          <TimezoneSelect />
        </div>
      </div>

      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto p-3 rounded-lg bg-white/5 border border-subtle"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-sm text-primary font-medium">
              {dateStr} &middot; {selectedTime}
            </span>
          </div>
        </motion.div>
      )}
    </aside>
  );
}
