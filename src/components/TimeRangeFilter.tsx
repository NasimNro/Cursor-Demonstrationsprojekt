"use client";
interface TimeRangeFilterProps {
  activeRange: "week" | "month" | "year" | "all";
  onRangeChange: (range: "week" | "month" | "year" | "all") => void;
}

export default function TimeRangeFilter({
  activeRange,
  onRangeChange,
}: TimeRangeFilterProps) {
  return (
    <div className="flex bg-gray-800 rounded-md p-0.5 text-xs sm:text-sm shadow-md">
      <button
        className={`px-2 py-1 rounded-md transition-colors ${
          activeRange === "week"
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700 text-gray-300"
        }`}
        onClick={() => onRangeChange("week")}
      >
        Week
      </button>
      <button
        className={`px-2 py-1 rounded-md transition-colors ${
          activeRange === "month"
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700 text-gray-300"
        }`}
        onClick={() => onRangeChange("month")}
      >
        Month
      </button>
      <button
        className={`px-2 py-1 rounded-md transition-colors ${
          activeRange === "year"
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700 text-gray-300"
        }`}
        onClick={() => onRangeChange("year")}
      >
        Year
      </button>
      <button
        className={`px-2 py-1 rounded-md transition-colors ${
          activeRange === "all"
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-700 text-gray-300"
        }`}
        onClick={() => onRangeChange("all")}
      >
        All
      </button>
    </div>
  );
}
