"use client";

interface TimeRangeFilterProps {
  activeRange: "week" | "month" | "6months" | "year" | "all";
  onRangeChange: (range: "week" | "month" | "6months" | "year" | "all") => void;
  weightDelta?: number | null;
}

export default function TimeRangeFilter({
  activeRange,
  onRangeChange,
  weightDelta,
}: TimeRangeFilterProps) {
  const buttons: { range: "week" | "month" | "6months" | "year" | "all"; label: string }[] = [
    { range: "week", label: "WEEK" },
    { range: "month", label: "MONTH" },
    { range: "6months", label: "6M" },
    { range: "year", label: "YEAR" },
    { range: "all", label: "ALL" },
  ];

  const deltaDisplay =
    weightDelta != null
      ? `${weightDelta > 0 ? "+" : ""}${weightDelta.toFixed(1)} kg`
      : null;

  const deltaColor =
    weightDelta == null
      ? ""
      : weightDelta > 0
      ? "text-emerald-400"
      : "text-red-400";

  return (
    <div className="relative z-20 flex items-center justify-between w-full">
      <div className="flex bg-transparent rounded-full p-1 text-[11px] sm:text-[12px] font-semibold text-gray-400 gap-1 flex-shrink-0">
        {buttons.map(({ range, label }) => (
          <button
            key={range}
            className={`px-3 py-1.5 rounded-full ${
              activeRange === range
                ? "bg-[#1f1f22] text-white"
                : "hover:text-gray-200"
            }`}
            onClick={() => onRangeChange(range)}
          >
            {label}
          </button>
        ))}
      </div>
      {deltaDisplay && (
        <span className={`text-[11px] sm:text-[12px] font-bold ${deltaColor} whitespace-nowrap flex-shrink-0 bg-[#1f1f22] rounded-full px-3 py-1.5 mr-1`}>
          {deltaDisplay}
        </span>
      )}
    </div>
  );
}
