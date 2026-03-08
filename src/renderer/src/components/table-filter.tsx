import { JSX, useState } from "react";

import { FilterPill } from "./filter-pill";

export function TableFilter(): JSX.Element {
  // Local state for demonstration. This will eventually map to your data filtering logic.
  const [activeFilters, setActiveFilters] = useState([
    { id: "1", label: "Status", value: "Available" },
    { id: "2", label: "Rank", value: "Α/Δ'" },
  ]);

  const removeFilter = (idToRemove: string): void => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== idToRemove));
  };

  const clearAll = (): void => {
    setActiveFilters([]);
  };

  // If there are no filters, we just show a subtle placeholder
  if (activeFilters.length === 0) {
    return <div className="text-muted text-sm italic">No active filters</div>;
  }

  return (
    <div className="flex items-center gap-2">
      {/* The horizontal list of pills */}
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            value={filter.value}
            onRemove={() => removeFilter(filter.id)}
          />
        ))}
      </div>

      {/* Global Clear Action */}
      <button
        onClick={clearAll}
        className="text-muted ml-2 rounded-md px-2 py-1 text-xs font-semibold transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        Clear all
      </button>
    </div>
  );
}
