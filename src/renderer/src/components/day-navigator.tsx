import { JSX } from "react";

import { useLocale } from "../store/LocaleContext";

interface DayNavigatorProps {
  availableDays: string[];
  currentDay: string;
  onDayChange: (day: string) => void;
}

export function DayNavigator({
  availableDays,
  currentDay,
  onDayChange,
}: DayNavigatorProps): JSX.Element {
  const { t } = useLocale();
  const idx = availableDays.indexOf(currentDay);
  const canPrev = idx > 0;
  const canNext = idx < availableDays.length - 1;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={() => canPrev && onDayChange(availableDays[idx - 1])}
        disabled={!canPrev}
        className="text-main flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-sm font-bold transition-colors hover:bg-slate-100 disabled:opacity-30 sm:h-8 sm:w-8 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ‹
      </button>

      <div className="text-main flex items-baseline gap-1.5 sm:gap-2">
        <span className="text-lg font-black tracking-tight tabular-nums sm:text-xl">
          {t.day} {currentDay}
        </span>
        <span className="text-muted text-[10px] font-medium sm:text-xs">
          / {availableDays.length} {t.days}
        </span>
      </div>

      <button
        onClick={() => canNext && onDayChange(availableDays[idx + 1])}
        disabled={!canNext}
        className="text-main flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-sm font-bold transition-colors hover:bg-slate-100 disabled:opacity-30 sm:h-8 sm:w-8 dark:border-slate-600 dark:hover:bg-slate-700"
      >
        ›
      </button>

      <select
        value={currentDay}
        onChange={(e) => onDayChange(e.target.value)}
        className="text-main bg-card ml-1 rounded-md border border-slate-300 px-1.5 py-1 text-[10px] font-medium sm:ml-2 sm:px-2 sm:text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        {availableDays.map((d) => (
          <option
            key={d}
            value={d}
            className="dark:bg-slate-800 dark:text-slate-200"
          >
            {t.day} {d}
          </option>
        ))}
      </select>
    </div>
  );
}
