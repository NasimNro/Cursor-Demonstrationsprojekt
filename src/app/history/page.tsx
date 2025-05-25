"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
    if (!confirm("Are you sure you want to delete this weight entry?")) return;

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
    <main className="h-[100svh] max-h-[100svh] bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col h-full max-h-full">
        <header className="mb-2 sm:mb-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Weight History</h1>
            <p className="text-xs sm:text-sm text-gray-400">
              View and manage your weight entries
            </p>
          </div>
          <Link
            href="/"
            className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </header>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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
            <>
              {weights.length === 0 ? (
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-300">
                    No weight entries yet. Add your first entry on the
                    dashboard!
                  </p>
                  <Link
                    href="/"
                    className="mt-4 inline-block px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <WeightList
                  weights={weights}
                  onEdit={handleEdit}
                  onDelete={deleteWeight}
                />
              )}
            </>
          )}
        </div>
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
        />
      </Modal>
    </main>
  );
}
