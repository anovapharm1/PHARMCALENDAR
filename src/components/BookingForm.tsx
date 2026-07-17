"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { cn } from "@/lib/utils";

export default function BookingForm() {
  const {
    step,
    selectedDate,
    selectedTime,
    duration,
    formData,
    updateFormData,
    backStep,
    advanceStep,
    bookSlot,
    isReschedule,
    clearRescheduleFlag,
  } = useBookingStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (step !== "form") return null;

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const dateParam = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInPerson = formData.meetingType === "In-Person Clinic Meeting";

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Required";
    if (!formData.email.trim()) e.email = "Required";
    else if (!emailRegex.test(formData.email)) e.email = "Invalid email";
    if (!formData.meetingType) e.meetingType = "Required";
    if (isInPerson) {
      if (!formData.clinicName.trim()) e.clinicName = "Required";
      if (!formData.clinicCity.trim()) e.clinicCity = "Required";
      if (!formData.clinicState.trim()) e.clinicState = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          meetingType: formData.meetingType,
          clinicName: formData.clinicName,
          clinicCity: formData.clinicCity,
          clinicState: formData.clinicState,
          notes: formData.notes,
          date: dateParam,
          time: selectedTime,
          duration,
          isReschedule: isReschedule || undefined,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      if (isReschedule) clearRescheduleFlag();
      if (selectedTime) {
        bookSlot({ date: dateParam, time: selectedTime });
      }
      advanceStep();
    } catch {
      setErrors({ ...errors, _form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const isEmailInvalid =
    formData.email.length > 0 && !emailRegex.test(formData.email);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.7)] backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md bg-card border border-subtle rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold text-primary">
              Confirm Meeting Details
            </h2>
            <button
              onClick={backStep}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-hover hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(212,101,74,0.1)] border border-[rgba(212,101,74,0.2)] text-xs text-secondary">
              <Clock className="w-3 h-3 text-[#D4654A]" />
              <span>
                {dateStr} {selectedTime} &middot; {duration} min
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-4">
            <Field
              label="Your name *"
              value={formData.name}
              onChange={(v) => updateFormData("name", v)}
              error={errors.name}
              placeholder="John Doe"
            />
            <Field
              label="Email address *"
              type="email"
              value={formData.email}
              onChange={(v) => updateFormData("email", v)}
              error={errors.email || (isEmailInvalid ? "Invalid email" : undefined)}
              placeholder="john@example.com"
            />
            <Field
              label="Phone number"
              type="tel"
              value={formData.phone}
              onChange={(v) => updateFormData("phone", v)}
              placeholder="+1 (555) 000-0000"
            />

            <div className="space-y-1.5">
              <label className="block text-sm text-primary font-medium">
                Select Meeting Type *
              </label>
              <select
                value={formData.meetingType}
                onChange={(e) => {
                  updateFormData("meetingType", e.target.value);
                  if (e.target.value !== "In-Person Clinic Meeting") {
                    updateFormData("clinicName", "");
                    updateFormData("clinicCity", "");
                    updateFormData("clinicState", "");
                  }
                }}
                className={cn(
                  "w-full bg-page border rounded-xl h-12 px-4 text-sm text-primary focus:outline-none focus:ring-1 transition-colors appearance-none",
                  errors.meetingType
                    ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
                    : "border-subtle focus:border-[#D4654A]/40 focus:ring-[#D4654A]/20",
                  !formData.meetingType && "text-muted"
                )}
              >
                <option value="" disabled className="bg-page">
                  Select a meeting type
                </option>
                <option value="Virtual Meeting" className="bg-page">
                  Virtual Meeting
                </option>
                <option value="In-Person Clinic Meeting" className="bg-page">
                  In-Person Clinic Meeting
                </option>
              </select>
              {errors.meetingType && (
                <p className="text-xs text-red-400">{errors.meetingType}</p>
              )}
            </div>

            {isInPerson && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Field
                  label="Clinic Name *"
                  value={formData.clinicName}
                  onChange={(v) => updateFormData("clinicName", v)}
                  error={errors.clinicName}
                  placeholder="City Health Clinic"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="City *"
                    value={formData.clinicCity}
                    onChange={(v) => updateFormData("clinicCity", v)}
                    error={errors.clinicCity}
                    placeholder="San Francisco"
                  />
                  <Field
                    label="State *"
                    value={formData.clinicState}
                    onChange={(v) => updateFormData("clinicState", v)}
                    error={errors.clinicState}
                    placeholder="California"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm text-primary font-medium">
                Additional notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                placeholder="Please share anything that will help prepare for our meeting."
                rows={3}
                className="w-full bg-page border border-subtle rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-[#D4654A]/40 focus:ring-1 focus:ring-[#D4654A]/20 resize-none transition-colors"
              />
            </div>
            {errors._form && (
              <p className="text-xs text-red-400 text-center">{errors._form}</p>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-subtle">
            <button
              onClick={backStep}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                !formData.name.trim() ||
                !formData.email.trim() ||
                !emailRegex.test(formData.email) ||
                !formData.meetingType ||
                (isInPerson &&
                  (!formData.clinicName.trim() ||
                    !formData.clinicCity.trim() ||
                    !formData.clinicState.trim()))
              }
              className="h-10 px-6 rounded-xl bg-[#D4654A] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#D4654A]/25"
            >
              {submitting ? "Booking..." : "Confirm"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-primary font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-page border rounded-xl h-12 px-4 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-1 transition-colors",
          error
            ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
            : "border-subtle focus:border-[#D4654A]/40 focus:ring-[#D4654A]/20"
        )}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
