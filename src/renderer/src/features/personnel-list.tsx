import { JSX } from "react";

import { Personnel, useRosterCache } from "../store/RosterContext";

export function PersonnelList(): JSX.Element {
  // Pull our mock data directly from the centralized cache
  const { personnel } = useRosterCache();

  // Helper to color-code the status indicator dots
  const getStatusColor = (status: Personnel["status"]): string => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]";
      case "ON_LEAVE":
        return "bg-red-500";
      case "DAY_OFF":
        return "bg-slate-400";
      default:
        return "bg-slate-200";
    }
  };

  // Helper to format the status text
  const getStatusLabel = (status: Personnel["status"]): string => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "ON_LEAVE":
        return "Άδεια (Leave)";
      case "DAY_OFF":
        return "Ρεπό (Day Off)";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {personnel.map((person) => (
        // The person.id ensures Stable Identity for smooth re-renders
        <div
          key={person.id}
          className="group border-border bg-card flex cursor-pointer items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:hover:border-blue-400"
        >
          <div className="flex flex-col gap-1">
            <span className="text-main text-sm font-bold">
              {person.rank} {person.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${getStatusColor(person.status)}`}
              />
              <span className="text-muted text-xs">
                {getStatusLabel(person.status)}
              </span>
            </div>
          </div>

          {/* Action icon that smoothly appears when hovering over the card */}
          <button
            className="text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-500"
            aria-label="Assign to shift"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
