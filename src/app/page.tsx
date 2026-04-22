"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subMonths, subWeeks, subYears } from "date-fns";

import WeightForm from "@/components/WeightForm";
import WeightChart from "@/components/WeightChart";
import TimeRangeFilter from "@/components/TimeRangeFilter";
import Modal from "@/components/Modal";
import WeightList from "@/components/WeightList";
import type { WeightEntry } from "@/types";

export default function Home() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [filteredWeights, setFilteredWeights] = useState<WeightEntry[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "6months" | "year" | "all">("month");
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
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setWeights(data);
    } catch (error) {
      console.error("Error fetching weight data:", error);
      setError("Failed to connect to MongoDB. Please make sure your MongoDB connection is properly configured.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new weight entry
  const addWeight = async (data: { weight: number; date: string; notes: string }) => {
    try {
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
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
  const updateWeight = async (data: { weight: number; date: string; notes: string }) => {
    if (!editingWeight) return;
    try {
      const response = await fetch(`/api/weight/${editingWeight._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      const updatedWeight = await response.json();
      setWeights((prev) => prev.map((w) => (w._id === updatedWeight._id ? updatedWeight : w)));
      setEditingWeight(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating weight entry:", error);
      alert("Failed to update weight entry. Please try again.");
    }
  };

  // Delete a weight entry — single central implementation
  const deleteWeight = async (id: string) => {
    try {
      await fetch(`/api/weight/${id}`, { method: "DELETE" });
      setWeights((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      alert("Failed to delete weight entry. Please try again.");
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
      case "6months":
        cutoffDate = subMonths(now, 6);
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
  const handleFormSubmit = async (data: { weight: number; date: string; notes: string }) => {
    if (editingWeight) {
      await updateWeight(data);
    } else {
      await addWeight(data);
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

  const getLatestWeight = () => {
    if (weights.length === 0) return "0.0";
    const sorted = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const w = sorted[sorted.length - 1].weight;
    const s = w.toFixed(2);
    return (s.endsWith("0") ? w.toFixed(1) : s).replace(".", ",");
  };

  const getLatestRawWeight = () => {
    if (weights.length === 0) return 80.0;
    const sorted = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted[sorted.length - 1].weight;
  };

  const getWeightDelta = (): number | null => {
    if (filteredWeights.length < 2) return null;
    const sorted = [...filteredWeights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted[sorted.length - 1].weight - sorted[0].weight;
  };

  return (
    <main className="min-h-[100svh] text-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 max-w-2xl">
        <header className="flex justify-between items-end mb-4 pt-1 flex-shrink-0">
          <div>
            <h1 className="text-[11px] sm:text-[13px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">
              CURRENT WEIGHT
            </h1>
            <div className="flex items-baseline">
              <span className="text-4xl sm:text-5xl font-bold text-white tracking-tighter">
                {getLatestWeight()}
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-gray-400 ml-1.5">kg</span>
            </div>
          </div>
          <div className="flex pb-1">
            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center"
            >
              <span className="mr-1.5 text-base leading-none font-light">+</span> Entry
            </button>
          </div>
        </header>

        {isLoading ? (
          <div>
            {/* Chart skeleton */}
            <div className="mb-6 bg-[#161618] rounded-[24px] p-4 border border-white/5">
              <div className="flex justify-center gap-2 mb-3">
                <div className="h-7 w-16 bg-white/5 rounded-full" />
                <div className="h-7 w-16 bg-white/10 rounded-full" />
                <div className="h-7 w-12 bg-white/5 rounded-full" />
                <div className="h-7 w-12 bg-white/5 rounded-full" />
              </div>
              <div className="h-[180px] bg-white/[0.03] rounded-xl" />
            </div>
            {/* History skeleton */}
            <div className="mb-4 px-1 flex justify-between items-center">
              <div className="h-5 w-16 bg-white/10 rounded" />
              <div className="h-4 w-16 bg-white/5 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#161618] rounded-xl p-4 flex items-center justify-between border border-white/[0.03]">
                  <div className="flex items-center">
                    <div className="w-1 h-8 rounded-full bg-white/10 mr-4" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-5 w-20 bg-white/10 rounded" />
                      <div className="h-3 w-24 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-14 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg mb-4 flex-shrink-0">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Connection Error</h2>
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
            {/* Chart Section */}
            <section className="mb-6 bg-[#161618] rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 w-full">
              <div className="flex justify-center items-center mb-2 px-2 relative z-20">
                <TimeRangeFilter activeRange={timeRange} onRangeChange={setTimeRange} weightDelta={getWeightDelta()} />
              </div>
              <div className="w-full" style={{ height: "220px" }}>
                <WeightChart weights={filteredWeights} />
              </div>
            </section>
            {/* History Preview List */}
            <section className="pb-8">
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-lg font-semibold text-white">History</h2>
                <Link href="/history" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                  See more
                </Link>
              </div>
              <WeightList
                weights={weights}
                onEdit={(w) => { setEditingWeight(w); setIsModalOpen(true); }}
              />
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
          defaultWeight={!editingWeight ? getLatestRawWeight() : undefined}
          onCancel={handleCloseModal}
          onDelete={editingWeight ? async () => {
            await deleteWeight(editingWeight._id);
            setEditingWeight(null);
            setIsModalOpen(false);
          } : undefined}
        />
      </Modal>
    </main>
  );
}
