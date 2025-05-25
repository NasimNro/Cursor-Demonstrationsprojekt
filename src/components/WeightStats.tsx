"use client";
import { useState, useEffect } from "react";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface WeightStatsProps {
  weights: WeightEntry[];
}

export default function WeightStats({ weights }: WeightStatsProps) {
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    initialWeight: 0,
    currentWeight: 0,
    weightDifference: 0,
    percentageChange: 0,
    weeklyChange: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate stats on client side only
  useEffect(() => {
    if (!isClient || weights.length === 0) return;

    // Sort weights by date
    const sortedWeights = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const currentWeight = sortedWeights[sortedWeights.length - 1].weight;
    const initialWeight = sortedWeights[0].weight;
    const weightDifference = currentWeight - initialWeight;
    const percentageChange = (weightDifference / initialWeight) * 100;

    // Calculate average weekly change
    let weeklyChange = 0;
    if (sortedWeights.length > 1) {
      const firstDate = new Date(sortedWeights[0].date);
      const lastDate = new Date(sortedWeights[sortedWeights.length - 1].date);
      const timeDiffInDays = Math.floor(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const timeDiffInWeeks = timeDiffInDays / 7;

      if (timeDiffInWeeks > 0) {
        weeklyChange = weightDifference / timeDiffInWeeks;
      }
    }

    setStats({
      initialWeight,
      currentWeight,
      weightDifference,
      percentageChange,
      weeklyChange,
    });
  }, [weights, isClient]);

  if (!isClient || weights.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {/* Initial Weight */}
      <div className="bg-gray-800 p-2 md:p-4 rounded-lg shadow-md">
        <h3 className="text-xs md:text-sm font-medium text-gray-400">
          Initial Weight
        </h3>
        <p className="text-base md:text-2xl font-bold text-gray-100">
          {stats.initialWeight} kg
        </p>
      </div>

      {/* Current Weight */}
      <div className="bg-gray-800 p-2 md:p-4 rounded-lg shadow-md">
        <h3 className="text-xs md:text-sm font-medium text-gray-400">
          Current Weight
        </h3>
        <p className="text-base md:text-2xl font-bold text-gray-100">
          {stats.currentWeight} kg
        </p>
      </div>

      {/* Total Change */}
      <div className="bg-gray-800 p-2 md:p-4 rounded-lg shadow-md">
        <h3 className="text-xs md:text-sm font-medium text-gray-400">
          Total Change
        </h3>
        <div className="flex items-center">
          <p className="text-base md:text-2xl font-bold text-gray-100">
            {stats.weightDifference.toFixed(1)} kg
          </p>
          <span
            className={`ml-1 md:ml-2 text-xs md:text-sm ${
              stats.weightDifference < 0
                ? "text-green-500"
                : stats.weightDifference > 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            ({stats.percentageChange.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Weekly Change */}
      <div className="bg-gray-800 p-2 md:p-4 rounded-lg shadow-md">
        <h3 className="text-xs md:text-sm font-medium text-gray-400">
          Weekly Change
        </h3>
        <div className="flex items-center">
          <p className="text-base md:text-2xl font-bold text-gray-100">
            {stats.weeklyChange.toFixed(2)} kg
          </p>
          <span
            className={`ml-1 md:ml-2 text-xs md:text-sm ${
              stats.weeklyChange < 0
                ? "text-green-500"
                : stats.weeklyChange > 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            per week
          </span>
        </div>
      </div>
    </div>
  );
}
