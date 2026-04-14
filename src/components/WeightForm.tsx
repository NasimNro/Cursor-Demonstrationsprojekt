"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import WeightPicker from "./WeightPicker";

interface WeightFormProps {
  onSubmit: (data: { weight: number; date: string; notes: string }) => void;
  onDelete?: () => void;
  initialData?: {
    _id?: string;
    weight: number;
    date: string;
    notes?: string;
  };
  defaultWeight?: number;
  onCancel?: () => void;
}

export default function WeightForm({
  onSubmit,
  onDelete,
  initialData,
  defaultWeight,
  onCancel,
}: WeightFormProps) {
  const [weight, setWeight] = useState<number>(initialData?.weight || defaultWeight || 80.0);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ weight?: string; date?: string }>({});

  useEffect(() => {
    if (initialData?.weight && initialData.weight !== weight) {
      setWeight(initialData.weight);
    } else if (defaultWeight && !initialData && defaultWeight !== weight) {
      setWeight(defaultWeight);
    }
    
    setDate(
      initialData?.date
        ? format(new Date(initialData.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")
    );
    setNotes(initialData?.notes || "");
  }, [initialData, defaultWeight, weight]);

  const validateForm = () => {
    const newErrors: { weight?: string; date?: string } = {};
    let isValid = true;

    if (!weight || weight < 20 || weight > 500) {
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
        weight,
        date,
        notes,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#161618] p-4 rounded-2xl shadow-2xl border border-white/5 overflow-hidden"
    >
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 text-center">
          Weight (kg)
        </label>
        <WeightPicker value={weight} onChange={setWeight} />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-400 text-center">{errors.weight}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 pl-1"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full px-4 py-3 bg-[#1e1e21] border-none rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 box-border max-w-full"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-400">{errors.date}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 pl-1"
        >
          Notes <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="block w-full px-4 py-3 bg-[#1e1e21] border-none rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          {initialData?._id && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2.5 text-red-400 text-sm font-medium rounded-full hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
        <div className="flex space-x-3">
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
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform active:scale-95"
          >
            {initialData?._id ? "Update" : "Save Entry"}
          </button>
        </div>
      </div>
    </form>
  );
}
