"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarX, ArrowLeft } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { generateAvailableSlots, isDayFullyBooked } from "@/lib/availability";
import { parseTimeDisplay } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ViewToggle from "./ViewToggle";

function formatTimeDisplay(
  hour: number,
  minute: number,
  use24h: boolean
): string {
  if (use24h) {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  }
  const period = hour >= 12 ? "pm" : "am";
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, "0")}${period}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function DayView({
  date,
  onSelect,
  selectedDate,
  selectedTime,
  use24h,
  isSlotBooked,
}: {
  date: Date;
  onSelect: (t: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  use24h: boolean;
  isSlotBooked: (slotDate: string, time: string) => boolean;
}) {
  const slots = useMemo(() => generateAvailableSlots(date), [date]);

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
        <CalendarX className="w-8 h-8" />
        <p className="text-sm">No available times for this day</p>
      </div>
    );
  }

  const dayLabel = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
  });

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-primary">{dayLabel}</h3>
      <div className="space-y-2">
        {slots.map((slot) => {
          const { hour, minute } = parseTimeDisplay(slot);
          const display = formatTimeDisplay(hour, minute, use24h);
          const isSelected =
            selectedDate &&
            isSameDay(date, selectedDate) &&
            selectedTime === display;
          const isBooked = isSlotBooked(date.toISOString().split("T")[0], display);
          return (
            <motion.button
              key={slot}
              onClick={() => !isBooked && onSelect(display)}
              whileHover={isBooked ? undefined : { y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "w-full h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors duration-150",
                isBooked
                  ? "border-subtle text-muted line-through cursor-not-allowed opacity-40"
                  : isSelected
                  ? "bg-active text-inverse border-active"
                  : "border-subtle text-primary hover:bg-hover"
              )}
            >
              {display}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  date,
  onSelect,
  selectedDate,
  selectedTime,
  use24h,
  isSlotBooked,
}: {
  date: Date;
  onSelect: (t: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  use24h: boolean;
  isSlotBooked: (slotDate: string, time: string) => boolean;
}) {
  const days = useMemo(() => {
    const result: Date[] = [];
    const dow = date.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    for (let i = 0; i < 5; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + mondayOffset + i);
      result.push(d);
    }
    return result;
  }, [date]);

  const slotsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const d of days) {
      const key = d.toISOString();
      const dd = new Date(d);
      map[key] = generateAvailableSlots(dd);
    }
    return map;
  }, [days]);

  const maxSlots = useMemo(
    () => Math.max(...Object.values(slotsMap).map((s) => s.length), 0),
    [slotsMap]
  );

  return (
    <div className="space-y-4">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
      >
        {days.map((d) => {
          const key = d.toISOString();
          const slots = slotsMap[key];
          const fullyBooked = isDayFullyBooked(d);
          const dayLabel = d.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
          });

          return (
            <div key={key} className="space-y-2">
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider text-center">
                {dayLabel}
              </h4>
              {fullyBooked ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted">
                  <CalendarX className="w-6 h-6" />
                  <span className="text-xs">All booked</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {slots.map((slot) => {
                    const { hour, minute } = parseTimeDisplay(slot);
                    const display = formatTimeDisplay(hour, minute, use24h);
                    const isSelected =
                      selectedDate &&
                      isSameDay(d, selectedDate) &&
                      selectedTime === display;
                    const isBooked = isSlotBooked(d.toISOString().split("T")[0], display);
                    return (
                      <motion.button
                        key={slot}
                        onClick={() => !isBooked && onSelect(display)}
                        whileHover={isBooked ? undefined : { y: -1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className={cn(
                          "w-full h-10 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors duration-150",
                          isBooked
                            ? "border-subtle text-muted line-through cursor-not-allowed opacity-40"
                            : isSelected
                            ? "bg-active text-inverse border-active"
                            : "border-subtle text-primary hover:bg-hover"
                        )}
                      >
                        {display}
                      </motion.button>
                    );
                  })}
                  {slots.length < maxSlots &&
                    Array.from({ length: maxSlots - slots.length }).map(
                      (_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="w-full h-10 rounded-lg border border-dashed border-white/[0.03]"
                        />
                      )
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TimeSlotGrid() {
  const {
    selectedDate,
    selectedTime,
    setTime,
    use24h,
    viewMode,
    advanceStep,
    backStep,
    bookedSlots,
  } = useBookingStore();

  if (!selectedDate) return null;

  const dateParam = selectedDate.toISOString().split("T")[0];
  const isSlotBooked = (slotDate: string, time: string) =>
    bookedSlots.some((s) => s.date === slotDate && s.time === time);

  function handleTimeSelect(time: string) {
    if (isSlotBooked(dateParam, time)) return;
    setTime(time);
    setTimeout(() => advanceStep(), 200);
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={backStep}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-secondary hover:bg-hover hover:text-primary transition-colors"
            title="Back to calendar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-primary tracking-tight">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
        </div>
        <ViewToggle />
      </div>

      {viewMode === "day" ? (
        <DayView
          date={selectedDate}
          onSelect={handleTimeSelect}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          use24h={use24h}
          isSlotBooked={isSlotBooked}
        />
      ) : (
        <WeekView
          date={selectedDate}
          onSelect={handleTimeSelect}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          use24h={use24h}
          isSlotBooked={isSlotBooked}
        />
      )}
    </div>
  );
}
