"use client";
import React from "react";

interface Timing {
  asap: boolean;
  scheduledDate: string | null;
  scheduledTime: string | null;
}

interface DateSelectionProps {
  timing: Timing;
  updateTiming: (timing: Timing) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function DateSelection({
  timing,
  updateTiming,
  onSubmit,
  onBack,
}: DateSelectionProps) {
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const asap = e.target.value === "asap";
    updateTiming({ ...timing, asap });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTiming({ ...timing, scheduledDate: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTiming({ ...timing, scheduledTime: e.target.value });
  };

  const isFormValid = () => {
    if (timing.asap) return true;
    return timing.scheduledDate && timing.scheduledTime;
  };

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="h-full w-full">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Πότε χρειάζεστε αυτή την υπηρεσία?
      </h2>

      <div className="flex align-start justify-start gap-4 h-full w-full">
        <div className={`flex-1 rounded-lg p-4 border border-[#FB7600] ${timing.asap ? 'bg-[#FB760033]' : 'bg-[transparent]'} `}>
          <label className="flex items-start justify-start">
            <input
              type="radio"
              name="timingOption"
              value="asap"
              checked={timing.asap}
              onChange={handleOptionChange}
              className="mr-2 h-4 w-4 text-[#FB7600]"
            />
            <span className="text-gray-600 text-lg font-semibold -mt-1">Tο συντομότερο δυνατό</span>
          </label>
          <p className="text-gray-600 text-sm">Επίλεξε αυτήν την επιλογή εάν αντιμετωπίζεις έκτακτη ανάγκη</p>
        </div>

        <div className={`flex-1 rounded-lg p-4 border border-[#FB7600] ${!timing.asap ? 'bg-[#FB760033]' : 'bg-[transparent]'} `}>
          <label className="flex items-start justify-start">
            <input
              type="radio"
              name="timingOption"
              value="scheduled"
              checked={!timing.asap}
              onChange={handleOptionChange}
              className="mr-2 h-4 w-4 text-[#FB7600]"
            />
            <span className="text-gray-600 text-lg font-semibold -mt-1">Ημερομηνία & Ώρα</span>
          </label>
          <p className="text-gray-600 text-sm">Επίλεξε αυτήν την επιλογή εάν έχεις κατά νου μια συγκεκριμένη ημερομηνία και ώρα</p>
        </div>
      </div>
      {!timing.asap && (
          <div className="ml-1 mt-4 flex align-start justify-between gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-md font-medium text-gray-600">
                Date
              </label>
              <input
                type="date"
                value={timing.scheduledDate || ""}
                onChange={handleDateChange}
                min={minDate}
                className="w-full rounded-lg text-gray-400 border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
                required={!timing.asap}
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-md font-medium text-gray-600">
                Preferred Time
              </label>
              <input
                type="time"
                value={timing.scheduledTime || ""}
                onChange={handleTimeChange}
                className="w-full rounded-lg text-gray-400 border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
                required={!timing.asap}
              />
            </div>
          </div>
        )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-[#FB7600] hover:text-white"
        >
          Πίσω
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid()}
          className="rounded-lg bg-[#FB7600] px-6 py-2 font-medium text-white transition-colors hover:bg-[#E56A00] hover:text-white disabled:bg-gray-300"
        >
          Ανέβασε την Αίτηση
        </button>
      </div>
    </div>
  );
} 