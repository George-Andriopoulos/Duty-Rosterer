import { JSX, ReactNode, useEffect, useState } from "react";

import { PersonnelList } from "@renderer/features/personnel-list";

import { TableFilter } from "../components/table-filter";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="bg-app text-main flex h-screen w-full overflow-hidden transition-colors duration-300">
      {/* LEFT PANE: Slightly narrower and more responsive */}
      <aside className="border-border bg-card flex w-64 flex-shrink-0 flex-col border-r shadow-sm transition-colors duration-300 xl:w-72">
        <div className="border-border flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Personnel</h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-md bg-slate-200 p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <PersonnelList />
        </div>
      </aside>

      {/* RIGHT PANE: Added min-w-0 to prevent flex blowout */}
      <main className="bg-app flex min-w-0 flex-1 flex-col transition-colors duration-300">
        {/* HEADER: Changed to min-h-[4rem] and added flex-wrap so filters don't squish the title */}
        <header className="border-border bg-card flex min-h-[4rem] flex-wrap items-center justify-between gap-4 border-b px-6 py-3 shadow-sm transition-colors duration-300">
          <h1 className="text-xl font-bold whitespace-nowrap">
            Duty Schedule Draft
          </h1>

          {/* Filters Container: Allows filters to wrap nicely on smaller windows */}
          <div className="flex min-w-[200px] flex-1 flex-wrap items-center justify-end">
            <TableFilter />
          </div>
        </header>

        {/* The Workspace Area */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
