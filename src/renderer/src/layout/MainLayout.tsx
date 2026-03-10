import { JSX, ReactNode, useEffect, useState } from "react";

import { DayNavigator } from "../components/day-navigator";
import { FileUploadZone } from "../components/file-upload-zone";
import { useLocale } from "../store/LocaleContext";
import { useRosterCache } from "../store/RosterContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { locale, setLocale, t } = useLocale();

  const {
    templatePath,
    templateTags,
    setTemplate,
    clearTemplate,
    personnel,
    setExcelData,
    clearExcel,
    availableDays,
    selectedDay,
    setSelectedDay,
    getExportData,
    isReady,
  } = useRosterCache();

  const firstDay = availableDays.length > 0 ? availableDays[0] : 1;
  const lastDay =
    availableDays.length > 0 ? availableDays[availableDays.length - 1] : 1;

  const [exportFrom, setExportFrom] = useState(firstDay);
  const [exportTo, setExportTo] = useState(lastDay);

  useEffect(() => {
    setExportFrom(firstDay);
    setExportTo(lastDay);
  }, [firstDay, lastDay]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
      const dayNumbers = extractDayNumbers(result.schedule);
      setExcelData(result.personnel, result.schedule, dayNumbers);
    } else if (result.error) {
      alert("Excel error: " + result.error);
    }
  };

  const handleExport = async (): Promise<void> => {
    if (!templatePath) {
      alert(t.alertUploadTemplate);
      return;
    }
    if (personnel.length === 0) {
      alert(t.alertUploadExcel);
      return;
    }

    setIsExporting(true);
    try {
      const dayDataMap = getExportData(exportFrom, exportTo);
      const dayCount = Object.keys(dayDataMap).length;

      if (dayCount === 0) {
        alert(t.alertNoData);
        setIsExporting(false);
        return;
      }

      const result = await window.api.exportDays({
        templatePath,
        dayDataMap,
      });

      if (result.success) {
        alert(t.alertExportSuccess(result.count ?? 0, result.outputDir ?? ""));
      } else {
        alert(t.alertExportFail + result.error);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(t.alertExportFail + String(error));
    } finally {
      setIsExporting(false);
    }
  };

  const templateStatus = templatePath ? t.tagsFound(templateTags.length) : null;

  const excelStatus =
    personnel.length > 0
      ? t.personnelDays(personnel.length, availableDays.length)
      : null;

  const totalDays = availableDays.length;

  // Build export button label
  const exportLabel = isExporting
    ? t.exporting
    : exportFrom === firstDay && exportTo === lastDay
      ? t.exportAll(totalDays)
      : exportFrom === exportTo
        ? t.exportDay(exportFrom)
        : t.exportDays(exportFrom, exportTo);

  return (
    <div className="bg-app text-main flex h-screen w-full flex-col overflow-hidden transition-colors duration-300">
      {/* TOP BAR */}
      <header className="border-border bg-card shrink-0 border-b shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between px-6 pt-4 pb-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-black tracking-tight">{t.appTitle}</h1>
            <span className="text-muted text-xs font-medium">
              {t.appSubtitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === "en" ? "el" : "en")}
              className="rounded-md bg-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {locale === "en" ? "🇬🇷 ΕΛ" : "🇬🇧 EN"}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-md bg-slate-200 p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-4">
          <FileUploadZone
            icon="📄"
            title={t.wordTemplate}
            description={t.wordTemplateDesc}
            status={templateStatus}
            onClick={handleUploadTemplate}
            onClear={clearTemplate}
          />
          <FileUploadZone
            icon="📊"
            title={t.excelSchedule}
            description={t.excelScheduleDesc}
            status={excelStatus}
            onClick={handleUploadExcel}
            onClear={clearExcel}
          />
        </div>
      </header>

      {/* TOOLBAR */}
      {isReady && (
        <div className="border-border bg-card flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-6 py-3 shadow-sm">
          <DayNavigator
            availableDays={availableDays}
            currentDay={selectedDay}
            onDayChange={setSelectedDay}
          />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-muted text-xs font-medium">{t.from}</label>
              <select
                value={exportFrom}
                onChange={(e) => setExportFrom(Number(e.target.value))}
                className="text-main bg-card rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                {availableDays.map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="dark:bg-slate-800 dark:text-slate-200"
                  >
                    {t.day} {d}
                  </option>
                ))}
              </select>

              <label className="text-muted text-xs font-medium">{t.to}</label>
              <select
                value={exportTo}
                onChange={(e) => setExportTo(Number(e.target.value))}
                className="text-main bg-card rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                {availableDays
                  .filter((d) => d >= exportFrom)
                  .map((d) => (
                    <option
                      key={d}
                      value={d}
                      className="dark:bg-slate-800 dark:text-slate-200"
                    >
                      {t.day} {d}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-wait disabled:opacity-60"
            >
              {exportLabel}
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="bg-app flex-1 overflow-auto p-6 transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}

function extractDayNumbers(
  schedule: Record<string, Record<string, string>>
): number[] {
  const daySet = new Set<number>();
  for (const personSchedule of Object.values(schedule)) {
    for (const dayStr of Object.keys(personSchedule)) {
      const num = Number(dayStr);
      if (!isNaN(num) && num > 0) {
        daySet.add(num);
      }
    }
  }
  return Array.from(daySet).sort((a, b) => a - b);
}
