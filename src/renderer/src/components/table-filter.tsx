import { JSX, useState } from "react";

import { FilterPill } from "./filter-pill";

export function TableFilter(): JSX.Element {
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

  if (activeFilters.length === 0) {
    return <div className="text-muted text-sm italic">No active filters</div>;
  }

  return (
    // We use flex-wrap here so pills drop to the next line if the window is too small
    <div className="flex flex-wrap items-center justify-end gap-2">
      {activeFilters.map((filter) => (
        <FilterPill
          key={filter.id}
          label={filter.label}
          value={filter.value}
          onRemove={() => removeFilter(filter.id)}
        />
      ))}

      {/* whitespace-nowrap ensures "Clear all" doesn't break into two words */}
      <button
        onClick={clearAll}
        className="text-muted ml-1 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        Clear all
      </button>
    </div>
  );
}
