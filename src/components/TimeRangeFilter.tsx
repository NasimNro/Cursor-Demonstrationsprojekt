"use client";
interface TimeRangeFilterProps {
 activeRange: "week" | "month" | "6months" | "year" | "all";
 onRangeChange: (range: "week" | "month" | "6months" | "year" | "all") => void;
}

export default function TimeRangeFilter({
 activeRange,
 onRangeChange,
}: TimeRangeFilterProps) {
 return (
 <div className="relative z-20 flex bg-transparent rounded-full p-1 text-[11px] sm:text-[12px] font-semibold text-gray-400 gap-1">
 <button
 className={`px-3 py-1.5 rounded-full ${
 activeRange === "week"
 ? "bg-[#1f1f22] text-white"
 : "hover:text-gray-200"
 }`}
 onClick={() => onRangeChange("week")}
 >
 WOCHE
 </button>
 <button
 className={`px-3 py-1.5 rounded-full ${
 activeRange === "month"
 ? "bg-[#1f1f22] text-white"
 : "hover:text-gray-200"
 }`}
 onClick={() => onRangeChange("month")}
 >
 MONAT
 </button>
 <button
 className={`px-3 py-1.5 rounded-full ${
 activeRange === "6months"
 ? "bg-[#1f1f22] text-white"
 : "hover:text-gray-200"
 }`}
 onClick={() => onRangeChange("6months")}
 >
 6M
 </button>
 <button
 className={`px-3 py-1.5 rounded-full ${
 activeRange === "year"
 ? "bg-[#1f1f22] text-white"
 : "hover:text-gray-200"
 }`}
 onClick={() => onRangeChange("year")}
 >
 JAHR
 </button>
 <button
 className={`px-3 py-1.5 rounded-full ${
 activeRange === "all"
 ? "bg-[#1f1f22] text-white"
 : "hover:text-gray-200"
 }`}
 onClick={() => onRangeChange("all")}
 >
 ALLE
 </button>
 </div>
 );
}
