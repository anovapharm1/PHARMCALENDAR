"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/store/bookingStore";
import { isDayFullyBooked } from "@/lib/availability";
import { cn } from "@/lib/utils";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const startOffset = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  for (let i = 0; i < startOffset; i++) {
    currentWeek.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function isToday(date: Date): boolean {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export default function MonthCalendar() {
  const { selectedDate, setDate } = useBookingStore();
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const grid = useMemo(
    () => getMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  function navigate(delta: number) {
    const newMonth = viewMonth + delta;
    if (newMonth < 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else if (newMonth > 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth(newMonth);
    }
  }

  function handleDateClick(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      return;
    if (isDayFullyBooked(d)) return;
    setDate(d);
  }

  function isDateAvailable(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      return false;
    return !isDayFullyBooked(d);
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary tracking-tight">
          {monthName}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-hover hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-hover hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-muted tracking-wider text-center h-6 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {grid.flat().map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="w-[48px] h-[48px]" />;
            }

            const dateObj = new Date(viewYear, viewMonth, day);
            const isSel = selectedDate && isSameDay(dateObj, selectedDate);
            const isTdy = isToday(dateObj);
            const disabled = !isDateAvailable(day);
            const isPast =
              dateObj <
              new Date(today.getFullYear(), today.getMonth(), today.getDate());

            return (
              <motion.button
                key={day}
                layout
                onClick={() => !disabled && !isPast && handleDateClick(day)}
                disabled={disabled || isPast}
                className={cn(
                  "relative w-[48px] h-[48px] flex items-center justify-center rounded-full text-sm font-medium transition-all duration-150",
                  isSel
                    ? "bg-[#D4654A] text-white font-semibold shadow-[0_0_0_3px_rgba(212,101,74,0.3)]"
                    : disabled || isPast
                    ? "text-muted opacity-25 cursor-not-allowed"
                    : "text-primary hover:bg-hover cursor-pointer"
                )}
              >
                {day}
                {isTdy && !isSel && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D4654A]" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
