"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/bookingStore";
import HostProfile from "@/components/HostProfile";
import MonthCalendar from "@/components/MonthCalendar";
import TimeSlotGrid from "@/components/TimeSlotGrid";
import BookingForm from "@/components/BookingForm";
import ConfirmationView from "@/components/ConfirmationView";

export default function Home() {
  const { step, selectedDate, selectedTime, setDate, setTime } = useBookingStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const timeParam = params.get("time");
    if (dateParam) {
      const d = new Date(dateParam);
      if (!isNaN(d.getTime())) {
        setDate(d);
      }
    }
    if (timeParam) {
      setTime(timeParam);
    }
  }, [setDate, setTime]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedDate) {
      params.set("date", selectedDate.toISOString().split("T")[0]);
    } else {
      params.delete("date");
    }
    if (selectedTime) {
      params.set("time", selectedTime);
    } else {
      params.delete("time");
    }
    const newUrl =
      params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [step, selectedDate, selectedTime]);

  return (
    <div className="min-h-screen bg-page flex flex-col lg:flex-row">
      <HostProfile />

      <main className="flex-1 flex flex-col min-h-0">
        {step === "success" ? (
          <ConfirmationView />
        ) : step === "week" && selectedDate ? (
          <TimeSlotGrid />
        ) : (
          <MonthCalendar />
        )}
      </main>

      <BookingForm />
    </div>
  );
}
