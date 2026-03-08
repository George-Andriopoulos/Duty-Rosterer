import { JSX, ReactNode, useEffect, useState } from "react";

import { TableFilter } from "@renderer/components/table-filter";

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
      {/* LEFT PANE: The Personnel Bank Sidebar */}
      <aside className="border-border bg-card flex w-80 flex-shrink-0 flex-col border-r shadow-sm transition-colors duration-300">
        <div className="border-border flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Personnel</h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-md bg-slate-200 p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Personnel List will go here later */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-muted text-sm">Loading personnel data...</p>
        </div>
      </aside>

      {/* RIGHT PANE: The Main Action Grid */}
      <main className="bg-app flex flex-1 flex-col transition-colors duration-300">
        {/* Top Header / Filter Area */}
        <header className="border-border bg-card flex h-16 items-center border-b px-6 shadow-sm transition-colors duration-300">
          <h1 className="text-xl font-bold">Duty Schedule Draft</h1>
          {/* This is exactly where we will drop in <TableFilter /> and <FilterPill /> */}
          <div className="ml-auto flex gap-2">
            <TableFilter />
          </div>
        </header>

        {/* The Workspace Area */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
