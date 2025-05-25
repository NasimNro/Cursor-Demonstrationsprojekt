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
}

export default function WeightList({
  weights,
  onEdit,
  onDelete,
}: WeightListProps) {
  const [isClient, setIsClient] = useState(false);
  const [formattedWeights, setFormattedWeights] = useState<
    Array<WeightEntry & { formattedDate: string }>
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

    // Format dates
    const formatted = sortedWeights.map((weight) => ({
      ...weight,
      formattedDate: format(new Date(weight.date), "MMM d, yyyy"),
    }));

    setFormattedWeights(formatted);
  }, [weights, isClient]);

  // Show a simple loading state if not on client
  if (!isClient) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-4">Loading...</div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Weight
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell"
              >
                Notes
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {formattedWeights.map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-750">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">
                  {entry.formattedDate}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-100">
                    {entry.weight} kg
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 hidden sm:table-cell">
                  {entry.notes || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(entry._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
