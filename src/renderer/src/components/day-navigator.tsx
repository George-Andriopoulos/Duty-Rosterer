import { JSX } from "react";

interface DayNavigatorProps {
  availableDays: number[];
  currentDay: number;
  onDayChange: (day: number) => void;
}

export function DayNavigator({
  availableDays,
  currentDay,
  onDayChange,
}: DayNavigatorProps): JSX.Element {
  const currentIndex = availableDays.indexOf(currentDay);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < availableDays.length - 1;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => canPrev && onDayChange(availableDays[currentIndex - 1])}
        disabled={!canPrev}
        className="text-main flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-sm font-bold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ‹
      </button>

      <div className="text-main flex items-baseline gap-2">
        <span className="text-xl font-black tracking-tight tabular-nums">
          Day {currentDay}
        </span>
        <span className="text-muted text-xs font-medium">
          / {availableDays.length} days
        </span>
      </div>

      <button
        onClick={() => canNext && onDayChange(availableDays[currentIndex + 1])}
        disabled={!canNext}
        className="text-main flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-sm font-bold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ›
      </button>

      <select
        value={currentDay}
        onChange={(e) => onDayChange(Number(e.target.value))}
        className="text-main bg-card ml-2 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        {availableDays.map((d) => (
          <option
            key={d}
            value={d}
            className="dark:bg-slate-800 dark:text-slate-200"
          >
            Day {d}
          </option>
        ))}
      </select>
    </div>
  );
}
