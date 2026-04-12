"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface WeightFormProps {
  onSubmit: (data: { weight: number; date: string; notes: string }) => void;
  initialData?: {
    _id?: string;
    weight: number;
    date: string;
    notes?: string;
  };
  onCancel?: () => void;
}

export default function WeightForm({
  onSubmit,
  initialData,
  onCancel,
}: WeightFormProps) {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ weight?: string; date?: string }>({});

  useEffect(() => {
    setWeight(initialData?.weight.toString() || "");
    setDate(
      initialData?.date
        ? format(new Date(initialData.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")
    );
    setNotes(initialData?.notes || "");
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { weight?: string; date?: string } = {};
    let isValid = true;

    if (
      !weight ||
      isNaN(Number(weight)) ||
      Number(weight) < 20 ||
      Number(weight) > 500
    ) {
      newErrors.weight = "Weight must be between 20kg and 500kg";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        weight: Number(weight),
        date,
        notes,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-[#121215] p-6 rounded-2xl shadow-2xl border border-white/5"
    >
      <h2 className="text-xl font-bold text-white tracking-wide">
        {initialData?._id ? "EDIT ENTRY" : "NEW ENTRY"}
      </h2>

      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
        >
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="block w-full px-4 py-3 bg-[#1e1e20] border-none rounded-xl text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          autoFocus
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-400">{errors.weight}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full px-4 py-3 bg-[#1e1e20] border-none rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-400">{errors.date}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
        >
          Notes <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="block w-full px-4 py-3 bg-[#1e1e20] border-none rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-transparent text-gray-400 font-medium rounded-full hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform hover:scale-105"
        >
          {initialData?._id ? "Update" : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
