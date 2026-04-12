"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import WeightList from "@/components/WeightList";
import Modal from "@/components/Modal";
import WeightForm from "@/components/WeightForm";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  notes?: string;
}

export default function HistoryPage() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
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

  // Delete a weight entry
  const deleteWeight = async (id: string) => {


    try {
      const response = await fetch(`/api/weight/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      setWeights((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      alert("Failed to delete weight entry. Please try again.");
    }
  };

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
    updateWeight(data);
  };

  // Handle edit button click
  const handleEdit = (weight: WeightEntry) => {
    setEditingWeight(weight);
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWeight(null);
  };

  return (
    <main className="min-h-[100svh] text-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 max-w-2xl">
        <motion.header
          className="mb-4 flex justify-between items-center flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-white">Weight History</h1>
          <Link
            href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform hover:scale-105 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </motion.header>

        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-2 pb-8">
            {[...Array(8)].map((_, i) => (
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
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            {weights.length === 0 ? (
              <div className="bg-[#161618] p-4 sm:p-6 rounded-2xl shadow-md text-center border border-white/5">
                <p className="text-gray-300">
                  No weight entries yet. Add your first entry on the
                  dashboard!
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="pb-8">
                <WeightList
                  weights={weights}
                  onEdit={handleEdit}
                  onDelete={deleteWeight}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal for editing weight entries */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Edit Weight Entry"
      >
        <WeightForm
          onSubmit={handleFormSubmit}
          initialData={editingWeight || undefined}
          onCancel={handleCloseModal}
          onDelete={editingWeight ? async () => {
              await fetch(`/api/weight/${editingWeight._id}`, { method: 'DELETE' });
              setWeights(prev => prev.filter(w => w._id !== editingWeight._id));
              setEditingWeight(null);
              setIsModalOpen(false);
          } : undefined}
        />
      </Modal>
    </main>
  );
}
