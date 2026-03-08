import { JSX, ReactNode, useEffect, useState } from "react";

import { TableFilter } from "../components/table-filter";
import { useRosterCache } from "../store/RosterContext";

interface TemplateSelectResult {
  success: boolean;
  filePath?: string;
}

interface ExportRosterResult {
  success: boolean;
  error?: string;
}

interface MainLayoutProps {
  children: ReactNode;
}

declare global {
  interface Window {
    api: {
      selectTemplate?: () => Promise<TemplateSelectResult>;
      exportRoster: (data: {
        templatePath: string;
        rosterData: Record<string, string>;
      }) => Promise<ExportRosterResult>;
    };
  }
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // NEW: State to hold the path of the Word template the user uploads
  const [templatePath, setTemplatePath] = useState<string | null>(null);

  const { assignments, personnel } = useRosterCache();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // NEW: Function to handle the template upload
  const handleUploadTemplate = async (): Promise<void> => {
    const result = await window.api.selectTemplate?.();
    if (result?.success && result?.filePath) {
      setTemplatePath(result.filePath);
    }
  };

  const handleExport = async (): Promise<void> => {
    if (!templatePath) {
      alert("Please upload a baseline Word template first!");
      return;
    }

    try {
      const exportData: Record<string, string> = {};

      assignments.forEach((assignment) => {
        const person = personnel.find((p) => p.id === assignment.personnelId);
        if (person) {
          const tagName = `${assignment.shiftId}_${assignment.day}`;
          exportData[tagName] = `${person.rank} ${person.name}`;
        }
      });

      // UPDATED: Now we pass BOTH the uploaded template path AND the data
      const result = await window.api.exportRoster({
        templatePath: templatePath,
        rosterData: exportData,
      });

      if (result.success) {
        alert("Success! Your Duty Roster has been generated.");
      } else {
        alert("Export failed: " + result.error);
      }
    } catch (error) {
      console.error("Export Error:", error);
      alert("Something went critically wrong with the export.");
    }
  };

  return (
    <div className="bg-app text-main flex h-screen w-full overflow-hidden transition-colors duration-300">
      {/* LEFT PANE */}
      <aside className="border-border bg-card flex w-64 shrink-0 flex-col border-r shadow-sm transition-colors duration-300 xl:w-72">
        <div className="border-border flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Personnel</h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-md bg-slate-200 p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto p-4"
          id="personnel-sidebar-container"
        >
          {/* <PersonnelList /> lives here! */}
        </div>
      </aside>

      {/* RIGHT PANE */}
      <main className="bg-app flex min-w-0 flex-1 flex-col transition-colors duration-300">
        {/* HEADER */}
        <header className="border-border bg-card flex min-h-16 flex-wrap items-center justify-between gap-4 border-b px-6 py-3 shadow-sm transition-colors duration-300">
          <h1 className="text-xl font-bold whitespace-nowrap">
            Duty Schedule Draft
          </h1>

          <div className="flex min-w-50 flex-1 flex-wrap items-center justify-end gap-4">
            <TableFilter />

            {/* THE UPLOAD BUTTON */}
            <button
              onClick={handleUploadTemplate}
              className={`rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap shadow-sm transition-colors active:scale-95 ${
                templatePath
                  ? "border border-green-300 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {templatePath ? "✓ Template Uploaded" : "📎 Upload Word Template"}
            </button>

            {/* THE EXPORT BUTTON */}
            <button
              onClick={handleExport}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-95"
            >
              Export to Word
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
