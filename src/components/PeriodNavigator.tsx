"use client";

interface PeriodNavigatorProps {
  label: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 11L9 7L5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PeriodNavigator({
  label,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}: PeriodNavigatorProps) {
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Previous period"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          canGoBack
            ? "bg-white/[0.08] text-gray-300 hover:bg-white/[0.14] hover:text-white active:bg-white/20"
            : "bg-white/[0.03] text-gray-700 cursor-default"
        }`}
      >
        <ChevronLeft />
      </button>

      <span className="text-[11px] sm:text-[12px] text-gray-400 font-medium tabular-nums">
        {label}
      </span>

      <button
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Next period"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          canGoForward
            ? "bg-white/[0.08] text-gray-300 hover:bg-white/[0.14] hover:text-white active:bg-white/20"
            : "bg-white/[0.03] text-gray-700 cursor-default"
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
