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
    setExcelData,
    clearExcel,
    availableDays,
    selectedDay,
    setSelectedDay,
    getExportData,
    isReady,
  } = useRosterCache();

  const firstDay = availableDays[0] ?? "1";
  const lastDay = availableDays[availableDays.length - 1] ?? "1";
  const [exportFrom, setExportFrom] = useState(firstDay);
  const [exportTo, setExportTo] = useState(lastDay);

  useEffect(() => {
    setExportFrom(firstDay);
    setExportTo(lastDay);
  }, [firstDay, lastDay]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
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
    if (result.success && result.schedule && result.dayNumbers) {
      setExcelData(
        result.schedule,
        result.tagDescriptions ?? {},
        result.dayNumbers
      );
    } else if (result.error) {
      alert(result.error);
    }
  };

  const handleExport = async (): Promise<void> => {
    if (!templatePath) {
      alert(t.alertUploadTemplate);
      return;
    }
    if (availableDays.length === 0) {
      alert(t.alertUploadExcel);
      return;
    }

    setIsExporting(true);
    try {
      const dayDataMap = getExportData(exportFrom, exportTo);
      if (Object.keys(dayDataMap).length === 0) {
        alert(t.alertNoData);
        setIsExporting(false);
        return;
      }

      const result = await window.api.exportDays({ templatePath, dayDataMap });
      if (result.success) {
        alert(t.alertExportOk(result.count ?? 0, result.outputDir ?? ""));
      } else {
        alert(t.alertExportFail + result.error);
      }
    } catch (e) {
      alert(t.alertExportFail + String(e));
    } finally {
      setIsExporting(false);
    }
  };

  const templateStatus = templatePath ? t.tagsFound(templateTags.length) : null;
  const excelStatus =
    availableDays.length > 0 ? t.daysLoaded(availableDays.length) : null;

  const exportLabel = isExporting
    ? t.exporting
    : exportFrom === firstDay && exportTo === lastDay
      ? t.exportAll(availableDays.length)
      : exportFrom === exportTo
        ? t.exportDay(exportFrom)
        : t.exportRange(exportFrom, exportTo);

  return (
    <div className="bg-app text-main flex h-screen w-full flex-col overflow-hidden transition-colors duration-300">
      {/* TOP BAR */}
      <header className="border-border bg-card shrink-0 border-b shadow-sm">
        {/* Title row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3">
          <div className="flex flex-col gap-0 sm:flex-row sm:items-baseline sm:gap-3">
            <h1 className="text-lg font-black tracking-tight sm:text-xl">
              {t.appTitle}
            </h1>
            <span className="text-muted text-[10px] font-medium sm:text-xs">
              {t.appSubtitle}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setLocale(locale === "en" ? "el" : "en")}
              className="rounded-md bg-slate-200 px-2 py-1.5 text-[10px] font-bold text-slate-700 transition-colors hover:bg-slate-300 sm:text-xs dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {locale === "en" ? "🇬🇷 ΕΛ" : "🇬🇧 EN"}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-md bg-slate-200 p-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 sm:p-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Upload zones — stack on small screens */}
        <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:gap-3 sm:px-6 sm:pb-4">
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

      {/* TOOLBAR — responsive wrap */}
      {isReady && (
        <div className="border-border bg-card flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2 shadow-sm sm:gap-3 sm:px-6 sm:py-3">
          <DayNavigator
            availableDays={availableDays}
            currentDay={selectedDay}
            onDayChange={setSelectedDay}
          />

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-muted text-[10px] font-medium sm:text-xs">
                {t.from}
              </label>
              <select
                value={exportFrom}
                onChange={(e) => setExportFrom(e.target.value)}
                className="text-main bg-card rounded-md border border-slate-300 px-1.5 py-1 text-[10px] font-medium sm:px-2 sm:py-1.5 sm:text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
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
              <label className="text-muted text-[10px] font-medium sm:text-xs">
                {t.to}
              </label>
              <select
                value={exportTo}
                onChange={(e) => setExportTo(e.target.value)}
                className="text-main bg-card rounded-md border border-slate-300 px-1.5 py-1 text-[10px] font-medium sm:px-2 sm:py-1.5 sm:text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                {availableDays
                  .filter((d) => Number(d) >= Number(exportFrom))
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
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {exportLabel}
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="bg-app flex-1 overflow-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
