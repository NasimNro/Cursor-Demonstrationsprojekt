"use client";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface WeightListProps {
  weights: WeightEntry[];
  onEdit: (weight: WeightEntry) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export default function WeightList({
  weights,
  onEdit,
  onDelete,
  compact = false,
}: WeightListProps) {
  const [isClient, setIsClient] = useState(false);
  const [formattedWeights, setFormattedWeights] = useState<
    Array<WeightEntry & { formattedDate: string; diffFromPrev?: number }>
  >([]);

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sort and format dates only on client-side
  useEffect(() => {
    if (!isClient) return;

    // Sort weights by date (newest first)
    const sortedWeights = [...weights].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Format dates and calculate diffs
    const formatted = sortedWeights.map((weight, index) => {
      // Find the next older date to calculate diff (since array is newest first, next item is older)
      const prevWeight = sortedWeights[index + 1];
      const diffFromPrev = prevWeight ? weight.weight - prevWeight.weight : undefined;

      return {
        ...weight,
        formattedDate: format(new Date(weight.date), "MMM d, yyyy"),
        diffFromPrev
      };
    });

    setFormattedWeights(formatted);
  }, [weights, isClient]);

  // Show a simple loading state if not on client
  if (!isClient) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {formattedWeights.map((entry) => (
        <div key={entry._id} className="bg-[#1c1c1e] rounded-xl flex items-center justify-between p-4 cursor-pointer hover:bg-[#2c2c2e] transition-colors" onClick={() => onEdit(entry)}>
          <div className="flex items-center">
            <div className="w-1 h-8 rounded-full bg-blue-300 mr-4 opacity-80" />
            <div className="flex flex-col">
              <span className="text-white font-semibold text-lg leading-tight mb-0.5">
                {entry.weight.toFixed(1).replace('.', ',')} kg
              </span>
              <span className="text-gray-400 text-xs">
                {entry.formattedDate}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {entry.diffFromPrev !== undefined && (
              <span className={`text-sm font-semibold ${
                entry.diffFromPrev < 0 ? "text-red-400" :
                entry.diffFromPrev > 0 ? "text-green-400" :
                "text-gray-500"
              }`}>
                {entry.diffFromPrev > 0 ? "+" : ""}{entry.diffFromPrev.toFixed(1).replace('.', ',')} kg
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
