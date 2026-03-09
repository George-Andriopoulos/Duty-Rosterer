import { JSX, useState } from "react";

import { PersonnelEntry } from "../store/RosterContext";

interface EditAssignmentModalProps {
  isOpen: boolean;
  tag: string;
  day: number;
  currentPerson: string;
  personnel: PersonnelEntry[];
  onAssign: (fullName: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function EditAssignmentModal({
  isOpen,
  tag,
  day,
  currentPerson,
  personnel,
  onAssign,
  onClear,
  onClose,
}: EditAssignmentModalProps): JSX.Element | null {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = personnel.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border-border w-full max-w-md overflow-hidden rounded-xl border shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-main text-base font-bold">Edit Assignment</h3>
            <p className="text-muted mt-0.5 text-xs">
              Day {day} — <span className="font-mono font-semibold">{tag}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-main flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg
              width="16"
              height="16"
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

        {/* Search */}
        <div className="border-border border-b px-5 py-3">
          <input
            type="text"
            placeholder="Search personnel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="text-main placeholder:text-muted w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600"
          />
        </div>

        {/* Personnel list */}
        <div className="max-h-64 overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <p className="text-muted px-3 py-4 text-center text-sm">
              No personnel found
            </p>
          ) : (
            filtered.map((p) => {
              const isCurrentlyAssigned = p.fullName === currentPerson;
              return (
                <button
                  key={p.fullName}
                  onClick={() => {
                    onAssign(p.fullName);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    isCurrentlyAssigned
                      ? "bg-blue-50 font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                      : "text-main hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className="font-medium">{p.fullName}</span>
                  {isCurrentlyAssigned && (
                    <span className="text-xs text-blue-500">Current</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer with Clear button */}
        {currentPerson && (
          <div className="border-border border-t px-5 py-3">
            <button
              onClick={() => {
                onClear();
                onClose();
              }}
              className="w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Clear Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
