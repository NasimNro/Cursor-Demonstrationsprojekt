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
      className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-100">
        {initialData?._id ? "Edit Weight Entry" : "Add New Weight Entry"}
      </h2>

      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-medium text-gray-300"
        >
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-500">{errors.weight}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-300"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-300"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData?._id ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
