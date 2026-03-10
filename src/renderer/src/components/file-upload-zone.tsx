import { JSX } from "react";

interface FileUploadZoneProps {
  icon: string;
  title: string;
  description: string;
  status: string | null;
  onClick: () => void;
  onClear?: () => void;
}

export function FileUploadZone({
  icon,
  title,
  description,
  status,
  onClick,
  onClear,
}: FileUploadZoneProps): JSX.Element {
  const isLoaded = status !== null;

  return (
    <div
      className={`group flex flex-1 items-center gap-4 rounded-lg border-2 border-dashed p-4 transition-all ${
        isLoaded
          ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
          : "border-border hover:border-slate-400 hover:bg-slate-50 dark:hover:border-slate-500 dark:hover:bg-slate-800/50"
      }`}
    >
      {/* Clickable area */}
      <button
        onClick={onClick}
        className="flex flex-1 items-center gap-4 text-left active:scale-[0.98]"
      >
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${
            isLoaded
              ? "bg-emerald-100 dark:bg-emerald-900/40"
              : "bg-slate-100 dark:bg-slate-800"
          }`}
        >
          {isLoaded ? "✓" : icon}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-bold ${isLoaded ? "text-emerald-700 dark:text-emerald-400" : "text-main"}`}
          >
            {title}
          </p>
          <p
            className={`truncate text-xs ${isLoaded ? "text-emerald-600 dark:text-emerald-500" : "text-muted"}`}
          >
            {isLoaded ? status : description}
          </p>
        </div>
      </button>

      {/* Clear button — only visible when loaded */}
      {isLoaded && onClear && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-emerald-600 transition-colors hover:bg-emerald-200 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-200"
          aria-label={`Clear ${title}`}
          title="Clear and re-upload"
        >
          <svg
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
      )}
    </div>
  );
}
