"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { addDays, subMonths, subWeeks, subYears } from "date-fns";
import WeightForm from "@/components/WeightForm";

import WeightChart from "@/components/WeightChart";
import WeightStats from "@/components/WeightStats";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import Modal from "@/components/Modal";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  notes?: string;
}

export default function Home() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [filteredWeights, setFilteredWeights] = useState<WeightEntry[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">(
    "month"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<WeightEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch weight data
  const fetchWeights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/weight");
      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }
      const data = await response.json();
      setWeights(data);
    } catch (error) {
      console.error("Error fetching weight data:", error);
      setError(
        "Failed to connect to MongoDB. Please make sure your MongoDB connection is properly configured."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new weight entry
  const addWeight = async (data: {
    weight: number;
    date: string;
    notes: string;
  }) => {
    try {
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const newWeight = await response.json();
      setWeights((prev) => [newWeight, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding weight entry:", error);
      alert("Failed to add weight entry. Please try again.");
    }
  };

  // Update an existing weight entry
  const updateWeight = async (data: {
    weight: number;
    date: string;
    notes: string;
  }) => {
    if (!editingWeight) return;

    try {
      const response = await fetch(`/api/weight/${editingWeight._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const updatedWeight = await response.json();
      setWeights((prev) =>
        prev.map((w) => (w._id === updatedWeight._id ? updatedWeight : w))
      );
      setEditingWeight(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating weight entry:", error);
      alert("Failed to update weight entry. Please try again.");
    }
  };

  // Filter weights based on time range
  useEffect(() => {
    if (weights.length === 0) {
      setFilteredWeights([]);
      return;
    }

    const now = new Date();
    let cutoffDate = now;

    switch (timeRange) {
      case "week":
        cutoffDate = subWeeks(now, 1);
        break;
      case "month":
        cutoffDate = subMonths(now, 1);
        break;
      case "year":
        cutoffDate = subYears(now, 1);
        break;
      case "all":
        setFilteredWeights(weights);
        return;
    }

    const filtered = weights.filter((w) => new Date(w.date) >= cutoffDate);
    setFilteredWeights(filtered);
  }, [weights, timeRange]);

  // Fetch weights on component mount
  useEffect(() => {
    fetchWeights();
  }, []);

  // Handle form submission
  const handleFormSubmit = (data: {
    weight: number;
    date: string;
    notes: string;
  }) => {
    if (editingWeight) {
      updateWeight(data);
    } else {
      addWeight(data);
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWeight(null);
  };

  // Open modal for adding new entry
  const handleAddNew = () => {
    setEditingWeight(null);
    setIsModalOpen(true);
  };

  return (
    <main className="h-[100svh] max-h-[100svh] bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col h-full max-h-full overflow-hidden">
        <header className="flex justify-between items-center mb-1 sm:mb-2 flex-shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Weight Tracker</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Track and visualize your weight journey
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddNew}
              className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg transition-colors"
            >
              Add Entry
            </button>
            <Link
              href="/history"
              className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">History</span>
            </Link>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg mb-4 flex-shrink-0">
            <h2 className="text-lg font-semibold text-red-400 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={fetchWeights}
              className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Stats Section - Only show if we have data, smaller on mobile */}
            {weights.length > 0 && (
              <section className="mb-2 flex-shrink-0">
                <WeightStats weights={weights} />
              </section>
            )}

            {/* Chart Section - Takes more space now */}
            <section className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between items-center mb-1 sm:mb-2 flex-shrink-0">
                <h2 className="text-base sm:text-xl font-semibold">
                  Weight Progress
                </h2>
                <TimeRangeFilter
                  activeRange={timeRange}
                  onRangeChange={setTimeRange}
                />
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                {" "}
                {/* This ensures the chart takes the remaining space */}
                <WeightChart weights={filteredWeights} timeRange={timeRange} />
              </div>
            </section>
          </>
        )}
      </div>

      {/* Modal for adding/editing weight entries */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWeight ? "Edit Weight Entry" : "Add New Weight Entry"}
      >
        <WeightForm
          onSubmit={handleFormSubmit}
          initialData={editingWeight || undefined}
          onCancel={handleCloseModal}
        />
      </Modal>
    </main>
  );
}
