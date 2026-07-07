import { create } from "zustand";

export type Step = "profile" | "month" | "week" | "form" | "success";
export type Duration = 15 | 30 | 45;

export interface BookedSlot {
  date: string;
  time: string;
}

interface BookingState {
  step: Step;
  selectedDate: Date | null;
  selectedTime: string | null;
  duration: Duration;
  timezone: string;
  use24h: boolean;
  viewMode: "day" | "week";
  formData: {
    name: string;
    email: string;
    phone: string;
    meetingType: string;
    clinicName: string;
    clinicCity: string;
    clinicState: string;
    notes: string;
  };
  bookedSlots: BookedSlot[];
  lastBookedSlot: BookedSlot | null;
  isReschedule: boolean;
  setDate: (d: Date) => void;
  setTime: (t: string | null) => void;
  setDuration: (d: Duration) => void;
  advanceStep: () => void;
  backStep: () => void;
  setTimezone: (tz: string) => void;
  toggle24h: () => void;
  setViewMode: (mode: "day" | "week") => void;
  updateFormData: (field: string, value: string) => void;
  bookSlot: (slot: BookedSlot) => void;
  reschedule: () => void;
  clearRescheduleFlag: () => void;
  reset: () => void;
}

const initialState = {
  step: "profile" as Step,
  selectedDate: null as Date | null,
  selectedTime: null as string | null,
  duration: 30 as Duration,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  use24h: false,
  viewMode: "day" as "day" | "week",
  formData: {
    name: "",
    email: "",
    phone: "",
    meetingType: "",
    clinicName: "",
    clinicCity: "",
    clinicState: "",
    notes: "",
  },
  bookedSlots: [] as BookedSlot[],
  lastBookedSlot: null as BookedSlot | null,
  isReschedule: false,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setDate: (d: Date) => {
    set({ selectedDate: d, selectedTime: null, step: "week" });
  },

  setTime: (t: string | null) => {
    set({ selectedTime: t });
  },

  setDuration: (d: Duration) => {
    set({ duration: d, selectedTime: null });
  },

  advanceStep: () => {
    const { step, selectedDate, selectedTime, formData } = get();
    switch (step) {
      case "profile":
        set({ step: "month" });
        break;
      case "month":
        if (selectedDate) set({ step: "week" });
        break;
      case "week":
        if (selectedDate && selectedTime) set({ step: "form" });
        break;
      case "form":
        if (formData.name && formData.email) set({ step: "success" });
        break;
      default:
        break;
    }
  },

  backStep: () => {
    const { step } = get();
    switch (step) {
      case "week":
        set({ step: "month", selectedDate: null, selectedTime: null });
        break;
      case "form":
        set({ step: "week" });
        break;
      case "success":
        set({ step: "form" });
        break;
      default:
        break;
    }
  },

  setTimezone: (tz: string) => set({ timezone: tz }),

  toggle24h: () => set((s) => ({ use24h: !s.use24h })),

  setViewMode: (mode) => set({ viewMode: mode }),

  updateFormData: (field: string, value: string) => {
    set((s) => ({
      formData: { ...s.formData, [field]: value },
    }));
  },

  bookSlot: (slot: BookedSlot) => {
    set((s) => ({
      bookedSlots: [...s.bookedSlots, slot],
      lastBookedSlot: slot,
    }));
  },

  reschedule: () => {
    const { lastBookedSlot, bookedSlots, selectedDate } = get();
    if (!lastBookedSlot) return;
    set({
      bookedSlots: bookedSlots.filter(
        (s) => s.date !== lastBookedSlot.date || s.time !== lastBookedSlot.time
      ),
      lastBookedSlot: null,
      selectedTime: null,
      isReschedule: true,
      step: selectedDate ? "week" : "month",
    });
  },

  clearRescheduleFlag: () => {
    set({ isReschedule: false });
  },

  reset: () => set({ ...initialState, timezone: get().timezone }),
}));
