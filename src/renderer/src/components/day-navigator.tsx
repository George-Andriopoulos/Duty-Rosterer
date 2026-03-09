import { JSX } from "react";

interface DayNavigatorProps {
  currentDay: number;
  totalDays: number;
  onDayChange: (day: number) => void;
}

export function DayNavigator({
  currentDay,
  totalDays,
  onDayChange,
}: DayNavigatorProps): JSX.Element {
  const canPrev = currentDay > 1;
  const canNext = currentDay < totalDays;

  return (
    <div className="flex items-center gap-3">
      {/* Previous */}
      <button
        onClick={() => canPrev && onDayChange(currentDay - 1)}
        disabled={!canPrev}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-sm font-bold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ‹
      </button>

      {/* Day display */}
      <div className="text-main flex items-baseline gap-2">
        <span className="text-xl font-black tracking-tight tabular-nums">
          Day {currentDay}
        </span>
        <span className="text-muted text-xs font-medium">/ {totalDays}</span>
      </div>

      {/* Next */}
      <button
        onClick={() => canNext && onDayChange(currentDay + 1)}
        disabled={!canNext}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-sm font-bold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ›
      </button>

      {/* Quick jump */}
      <select
        value={currentDay}
        onChange={(e) => onDayChange(Number(e.target.value))}
        className="text-main ml-2 rounded-md border border-slate-300 bg-transparent px-2 py-1 text-xs font-medium dark:border-slate-600"
      >
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>
            Day {d}
          </option>
        ))}
      </select>
    </div>
  );
}
