import { JSX, ReactNode, useEffect, useState } from "react";

import { DayNavigator } from "@renderer/components/day-navigator";
import { FileUploadZone } from "@renderer/components/file-upload-zone";

import { useRosterCache } from "../store/RosterContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const {
    templatePath,
    templateTags,
    setTemplate,
    personnel,
    setExcelData,
    totalDays,
    selectedDay,
    setSelectedDay,
    getExportData,
    isReady,
  } = useRosterCache();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ── Upload handlers ──────────────────────

  const handleUploadTemplate = async (): Promise<void> => {
    const result = await window.api.scanTemplate();
    if (result.success && result.filePath && result.tags) {
      setTemplate(result.filePath, result.tags);
    } else if (result.error) {
      alert(result.error);
    }
  };

  const handleUploadExcel = async (): Promise<void> => {
    const result = await window.api.parseExcel();
    if (result.success && result.personnel && result.schedule) {
      setExcelData(result.personnel, result.schedule, result.totalDays ?? 31);
    } else if (result.error) {
      alert("Excel error: " + result.error);
    }
  };

  // ── Export handler ───────────────────────

  const handleExport = async (): Promise<void> => {
    if (!templatePath) {
      alert("Please upload a Word template first.");
      return;
    }
    if (personnel.length === 0) {
      alert("Please upload an Excel schedule first.");
      return;
    }

    setIsExporting(true);
    try {
      const dayDataMap = getExportData();
      const result = await window.api.exportDays({
        templatePath,
        dayDataMap,
      });

      if (result.success) {
        alert(
          `Done! Generated ${result.count} documents in:\n${result.outputDir}`
        );
      } else {
        alert("Export failed: " + result.error);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Something went wrong during export.");
    } finally {
      setIsExporting(false);
    }
  };

  // ── Template/Excel status strings ────────

  const templateStatus = templatePath
    ? `${templateTags.length} tags found`
    : null;

  const excelStatus =
    personnel.length > 0
      ? `${personnel.length} personnel · ${totalDays} days`
      : null;

  return (
    <div className="bg-app text-main flex h-screen w-full flex-col overflow-hidden transition-colors duration-300">
      {/* ── TOP BAR ── */}
      <header className="border-border bg-card shrink-0 border-b shadow-sm transition-colors duration-300">
        {/* Row 1: Title + theme toggle */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-black tracking-tight">Duty Rosterer</h1>
            <span className="text-muted text-xs font-medium">
              Template-driven roster generator
            </span>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-md bg-slate-200 p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Row 2: Upload zones */}
        <div className="flex gap-3 px-6 pb-4">
          <FileUploadZone
            icon="📄"
            title="Word Template"
            description="Select .docx with {tags} for each position"
            status={templateStatus}
            onClick={handleUploadTemplate}
          />
          <FileUploadZone
            icon="📊"
            title="Excel Schedule"
            description="Select .xlsx with personnel assignments"
            status={excelStatus}
            onClick={handleUploadExcel}
          />
        </div>
      </header>

      {/* ── TOOLBAR (only visible when data is loaded) ── */}
      {isReady && (
        <div className="border-border bg-card flex shrink-0 items-center justify-between border-b px-6 py-3 shadow-sm">
          <DayNavigator
            currentDay={selectedDay}
            totalDays={totalDays}
            onDayChange={setSelectedDay}
          />

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            {isExporting ? "Exporting..." : `Export All ${totalDays} Days`}
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="bg-app flex-1 overflow-auto p-6 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
