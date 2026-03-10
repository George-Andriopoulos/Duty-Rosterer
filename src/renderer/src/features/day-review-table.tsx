import { JSX, useMemo, useState } from "react";

import { useLocale } from "../store/LocaleContext";
import { useRosterCache } from "../store/RosterContext";

export function DayReviewTable(): JSX.Element {
  const { t } = useLocale();
  const {
    templateTags,
    tagDescriptions,
    selectedDay,
    getDayAssignments,
    editAssignment,
    clearAssignment,
    isReady,
  } = useRosterCache();

  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const assignments = useMemo(
    () => getDayAssignments(selectedDay),
    [getDayAssignments, selectedDay]
  );

  const filledCount = Object.values(assignments).filter((v) => v !== "").length;
  const totalCount = templateTags.length;

  if (!isReady) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-20">
        <div className="text-4xl">📋</div>
        <p className="text-main text-lg font-bold">{t.noDataTitle}</p>
        <p className="text-muted max-w-sm text-center text-sm">
          {t.noDataDesc}
        </p>
      </div>
    );
  }

  const handleStartEdit = (tag: string, currentValue: string): void => {
    setEditingTag(tag);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (): void => {
    if (editingTag) {
      if (editValue.trim()) {
        editAssignment(selectedDay, editingTag, editValue.trim());
      } else {
        clearAssignment(selectedDay, editingTag);
      }
      setEditingTag(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = (): void => {
    setEditingTag(null);
    setEditValue("");
  };

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <p className="text-muted text-xs sm:text-sm">
          {t.positionsFilled(filledCount, totalCount)}
        </p>
        {filledCount < totalCount && (
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {t.unfilled(totalCount - filledCount)}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{
            width:
              totalCount > 0 ? `${(filledCount / totalCount) * 100}%` : "0%",
          }}
        />
      </div>

      {/* Table */}
      <div className="border-border flex-1 overflow-auto rounded-xl border">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="border-border text-muted w-8 border-b px-2 py-2 text-left text-[10px] font-semibold tracking-wider uppercase sm:w-12 sm:px-4 sm:py-3 sm:text-xs">
                #
              </th>
              <th className="border-border text-muted hidden border-b px-2 py-2 text-left text-[10px] font-semibold tracking-wider uppercase sm:table-cell sm:px-4 sm:py-3 sm:text-xs">
                {t.tag}
              </th>
              <th className="border-border text-muted border-b px-2 py-2 text-left text-[10px] font-semibold tracking-wider uppercase sm:px-4 sm:py-3 sm:text-xs">
                {t.description}
              </th>
              <th className="border-border text-muted border-b px-2 py-2 text-left text-[10px] font-semibold tracking-wider uppercase sm:px-4 sm:py-3 sm:text-xs">
                {t.assignedPerson}
              </th>
              <th className="border-border w-14 border-b px-2 py-2 text-right text-[10px] font-semibold tracking-wider uppercase sm:w-20 sm:px-4 sm:py-3 sm:text-xs">
                {t.edit}
              </th>
            </tr>
          </thead>
          <tbody>
            {templateTags.map((tag, index) => {
              const person = assignments[tag] || "";
              const isEmpty = person === "";
              const desc = tagDescriptions[tag] || "";
              const isEditing = editingTag === tag;

              return (
                <tr
                  key={tag}
                  className={`transition-colors ${
                    isEmpty
                      ? "bg-amber-50/30 dark:bg-amber-950/10"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <td className="border-border text-muted border-b px-2 py-2 tabular-nums sm:px-4 sm:py-3">
                    {index + 1}
                  </td>
                  <td className="border-border hidden border-b px-2 py-2 sm:table-cell sm:px-4 sm:py-3">
                    <code className="text-muted rounded bg-slate-100 px-1 py-0.5 text-[10px] font-medium sm:text-xs dark:bg-slate-700">
                      {tag}
                    </code>
                  </td>
                  <td className="border-border border-b px-2 py-2 sm:px-4 sm:py-3">
                    <span className="text-main text-xs font-semibold sm:text-sm">
                      {desc || tag}
                    </span>
                  </td>
                  <td className="border-border border-b px-2 py-2 sm:px-4 sm:py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          autoFocus
                          className="text-main w-full min-w-0 rounded border border-blue-400 bg-transparent px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                          placeholder={t.searchPlaceholder}
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="shrink-0 rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-700"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-muted shrink-0 rounded px-1.5 py-1 text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : isEmpty ? (
                      <span className="text-xs text-slate-400 italic dark:text-slate-500">
                        {t.emptySlot}
                      </span>
                    ) : (
                      <span className="text-main text-xs font-semibold sm:text-sm">
                        {person}
                      </span>
                    )}
                  </td>
                  <td className="border-border border-b px-2 py-2 text-right sm:px-4 sm:py-3">
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(tag, person)}
                        className="text-muted hover:text-main rounded-md p-1 transition-colors hover:bg-slate-100 sm:p-1.5 dark:hover:bg-slate-700"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
