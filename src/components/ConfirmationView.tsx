"use client";

import { motion } from "framer-motion";
import { Check, Download, Calendar, RefreshCw } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";

export default function ConfirmationView() {
  const { selectedDate, selectedTime, duration, reschedule } = useBookingStore();

  if (!selectedDate || !selectedTime) return null;

  const dateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const startHour = parseInt(selectedTime.split(":")[0]);
  const startMin = parseInt(selectedTime.replace(/[^0-9:]/g, "").split(":")[1] || "0");
  const isPM = selectedTime.includes("pm");
  const hour24 = isPM && startHour !== 12 ? startHour + 12 : !isPM && startHour === 12 ? 0 : startHour;

  const endDate = new Date(selectedDate);
  endDate.setHours(hour24, startMin + duration);

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting+with+Peer&dates=${selectedDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${selectedDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    "SUMMARY:Meeting with Peer",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  function downloadICS() {
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center justify-center p-6 lg:p-8 min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-[rgba(30,64,175,0.25)]"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#1e293b] tracking-tight">
            You&apos;re scheduled
          </h2>
          <p className="text-sm text-[#94a3b8]">
            A calendar invitation is on its way.
          </p>
        </div>

        <div className="w-full p-4 bg-white border border-[#e2e8f0] rounded-xl space-y-1 text-sm shadow-sm">
          <p className="text-[#1e293b] font-medium">
            {dateStr}
          </p>
          <p className="text-[#64748b]">
            {selectedTime} &middot; {duration} minutes
          </p>
          <p className="text-[#94a3b8]">Peer Richelson</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={downloadICS}
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[#e2e8f0] text-sm text-[#1e293b] hover:bg-[#f8f9fc] transition-colors bg-white"
          >
            <Download className="w-4 h-4" />
            Add to Calendar (.ics)
          </button>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[#e2e8f0] text-sm text-[#1e293b] hover:bg-[#f8f9fc] transition-colors bg-white"
          >
            <Calendar className="w-4 h-4" />
            Google Calendar
          </a>
          <a
            href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=Meeting+with+Peer&startdt=${selectedDate.toISOString()}&enddt=${endDate.toISOString()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[#e2e8f0] text-sm text-[#1e293b] hover:bg-[#f8f9fc] transition-colors bg-white"
          >
            <Calendar className="w-4 h-4" />
            Outlook Calendar
          </a>
          <button
            onClick={reschedule}
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[#e2e8f0] text-sm text-[#94a3b8] hover:text-[#64748b] hover:bg-[#f8f9fc] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reschedule Meeting
          </button>
        </div>
      </motion.div>
    </div>
  );
}
