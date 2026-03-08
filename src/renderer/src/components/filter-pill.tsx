import { JSX } from "react";

interface FilterPillProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterPill({
  label,
  value,
  onRemove,
}: FilterPillProps): JSX.Element {
  return (
    <div className="group border-border text-main flex items-center gap-1.5 rounded-full border bg-slate-50 py-1 pr-1.5 pl-3 text-sm font-medium transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
      {/* The Category Key (e.g., "Rank") */}
      <span className="text-muted">{label}:</span>

      {/* The Selected Value (e.g., "Α/Δ'") */}
      <span>{value}</span>

      {/* The Dismiss Button */}
      <button
        onClick={onRemove}
        className="text-muted ml-1 flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
