import { JSX } from "react";

interface FileUploadZoneProps {
  icon: string;
  title: string;
  description: string;
  status: string | null; // null = not loaded, string = success message
  onClick: () => void;
}

export function FileUploadZone({
  icon,
  title,
  description,
  status,
  onClick,
}: FileUploadZoneProps): JSX.Element {
  const isLoaded = status !== null;

  return (
    <button
      onClick={onClick}
      className={`group flex flex-1 items-center gap-4 rounded-lg border-2 border-dashed p-4 text-left transition-all active:scale-[0.98] ${
        isLoaded
          ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
          : "border-border hover:border-slate-400 hover:bg-slate-50 dark:hover:border-slate-500 dark:hover:bg-slate-800/50"
      }`}
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
          {isLoaded ? title : title}
        </p>
        <p
          className={`truncate text-xs ${isLoaded ? "text-emerald-600 dark:text-emerald-500" : "text-muted"}`}
        >
          {isLoaded ? status : description}
        </p>
      </div>
    </button>
  );
}
