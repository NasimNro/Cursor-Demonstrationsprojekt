"use client";

interface PeriodNavigatorProps {
  label: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

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
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
          canGoBack
            ? "text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15"
            : "text-gray-700 cursor-default"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <span className="text-[11px] sm:text-[12px] text-gray-400 font-medium tabular-nums">
        {label}
      </span>

      <button
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Next period"
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
          canGoForward
            ? "text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15"
            : "text-gray-700 cursor-default"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 11L9 7L5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
