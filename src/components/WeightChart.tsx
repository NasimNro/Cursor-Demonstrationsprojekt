"use client";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData,
  ChartOptions,
  TooltipItem,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface WeightChartProps {
  weights: WeightEntry[];
}

export default function WeightChart({ weights }: WeightChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures we're only rendering the chart on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (weights.length === 0 || !isClient) return;

    // Sort weights by date
    const sortedWeights = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format dates for display - Only run this on the client side
    const labels = sortedWeights.map((entry) =>
      format(new Date(entry.date), "MM/dd/yyyy")
    );

    const weightData = sortedWeights.map((entry) => entry.weight);

    // Calculate trend line data
    const trendData = calculateTrendLine(sortedWeights);

    setChartData({
      labels,
      datasets: [
        {
          label: "Weight (kg)",
          data: weightData,
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
        },
        {
          label: "Trend",
          data: trendData,
          borderColor: "rgba(249, 115, 22, 0.7)",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
      ],
    });
  }, [weights, isClient]);

  // Calculate trend line using linear regression
  const calculateTrendLine = (weights: WeightEntry[]) => {
    if (weights.length < 2) return [];

    const n = weights.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    weights.forEach((weight, index) => {
      sumX += index;
      sumY += weight.weight;
      sumXY += index * weight.weight;
      sumXX += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return weights.map((_, index) => slope * index + intercept);
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "'Inter', sans-serif",
          },
          callback: function (value: string | number) {
            return `${Number(value).toFixed(1)} kg`;
          },
        },
      },
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: {
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        padding: 12,
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            return `Weight: ${context.parsed.y} kg`;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.2,
      },
    },
    animation: {
      duration: 800,
    },
  };

  if (!isClient) {
    // Return empty div during server-side rendering
    return <div className="bg-gray-800 p-6 rounded-lg shadow-md h-full"></div>;
  }

  if (weights.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center bg-gray-800 rounded-lg p-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-300">No Data Available</h3>
        <p className="text-sm text-gray-400 mt-2">
          Add your first weight entry to start tracking your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 rounded-lg p-2 sm:p-4 shadow-md overflow-hidden">
      <div className="w-full h-full overflow-hidden">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
