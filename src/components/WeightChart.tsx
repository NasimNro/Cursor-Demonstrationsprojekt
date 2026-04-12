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
      format(new Date(entry.date), "dd.MM.")
    );

    const weightData = sortedWeights.map((entry) => entry.weight);

    setChartData({
      labels,
      datasets: [
        {
          label: "Weight (kg)",
          data: weightData,
          borderColor: "rgba(164, 184, 219, 1)",
          borderWidth: 3,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, "rgba(164, 184, 219, 0.4)");
            gradient.addColorStop(1, "rgba(164, 184, 219, 0.0)");
            return gradient;
          },
          fill: true,
          pointBackgroundColor: "rgba(164, 184, 219, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4, // Smooth curve
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
    layout: {
      padding: {
        top: 10,
        right: 4,
        bottom: 4,
        left: 4
      }
    },
    scales: {
      y: {
        display: true,
        beginAtZero: false,
        suggestedMin: Math.min(...weights.map(w => w.weight)) - 1,
        suggestedMax: Math.max(...weights.map(w => w.weight)) + 1,
        position: 'right' as const,
        grid: {
          color: "rgba(255, 255, 255, 0.06)",
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            family: "'Inter', sans-serif",
            size: 10,
          },
          padding: 8,
          stepSize: 1,
          maxTicksLimit: 6,
          callback: function(value: any) {
            return Number(value).toFixed(0);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            family: "'Inter', sans-serif",
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
          padding: 4,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
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
    <div className="w-full h-full">
      <Line options={options} data={chartData} />
    </div>
  );
}
