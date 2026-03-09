import { JSX, useMemo, useState } from "react";

import { useRosterCache } from "../store/RosterContext";
import { EditAssignmentModal } from "./edit-assignment-modal";

export function DayReviewTable(): JSX.Element {
  const {
    templateTags,
    personnel,
    selectedDay,
    getDayAssignments,
    getUnmatchedPersonnel,
    editAssignment,
    clearAssignment,
    isReady,
  } = useRosterCache();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    tag: string;
    currentPerson: string;
  }>({
    isOpen: false,
    tag: "",
    currentPerson: "",
  });

  // Build the current day's assignment map
  const assignments = useMemo(
    () => getDayAssignments(selectedDay),
    [getDayAssignments, selectedDay]
  );

  // Find people assigned in Excel to tags that don't exist in the template
  const unmatched = useMemo(
    () => getUnmatchedPersonnel(selectedDay),
    [getUnmatchedPersonnel, selectedDay]
  );

  // Stats
  const filledCount = Object.values(assignments).filter((v) => v !== "").length;
  const totalCount = templateTags.length;

  if (!isReady) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-20">
        <div className="text-4xl">📋</div>
        <p className="text-main text-lg font-bold">No Data Yet</p>
        <p className="text-muted max-w-sm text-center text-sm">
          Upload a Word template and an Excel schedule above to start reviewing
          assignments.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">
          <span className="text-main font-bold">{filledCount}</span> /{" "}
          {totalCount} positions filled
        </p>
        {filledCount < totalCount && (
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {totalCount - filledCount} unfilled
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

      {/* Assignment table */}
      <div className="border-border flex-1 overflow-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="border-border text-muted w-12 border-b px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                #
              </th>
              <th className="border-border text-muted border-b px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                Template Tag
              </th>
              <th className="border-border text-muted border-b px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                Assigned Person
              </th>
              <th className="border-border w-20 border-b px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {templateTags.map((tag, index) => {
              const person = assignments[tag] || "";
              const isEmpty = person === "";

              return (
                <tr
                  key={tag}
                  className={`transition-colors ${
                    isEmpty
                      ? "bg-amber-50/50 dark:bg-amber-950/10"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {/* Row number */}
                  <td className="border-border text-muted border-b px-4 py-3 tabular-nums">
                    {index + 1}
                  </td>

                  {/* Tag name */}
                  <td className="border-border border-b px-4 py-3">
                    <code className="text-main rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold dark:bg-slate-700">
                      {tag}
                    </code>
                  </td>

                  {/* Assigned person */}
                  <td className="border-border border-b px-4 py-3">
                    {isEmpty ? (
                      <span className="text-xs font-medium text-amber-600 italic dark:text-amber-400">
                        — Unfilled —
                      </span>
                    ) : (
                      <span className="text-main font-semibold">{person}</span>
                    )}
                  </td>

                  {/* Edit button */}
                  <td className="border-border border-b px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        setModalState({
                          isOpen: true,
                          tag,
                          currentPerson: person,
                        })
                      }
                      className="text-muted hover:text-main rounded-md p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label={`Edit ${tag}`}
                    >
                      <svg
                        width="15"
                        height="15"
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Unmatched personnel warning */}
      {unmatched.length > 0 && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
          <p className="mb-2 text-sm font-bold text-orange-800 dark:text-orange-300">
            Unmatched Assignments ({unmatched.length})
          </p>
          <p className="text-muted mb-2 text-xs">
            These people have a tag in the Excel that doesn&apos;t match any tag
            in your Word template:
          </p>
          <div className="flex flex-wrap gap-2">
            {unmatched.map((u, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-md border border-orange-200 bg-white px-2 py-1 text-xs dark:border-orange-800 dark:bg-orange-950/30"
              >
                <span className="font-semibold text-orange-700 dark:text-orange-300">
                  {u.fullName}
                </span>
                <span className="text-muted">→</span>
                <code className="font-mono text-orange-600 dark:text-orange-400">
                  {u.tag}
                </code>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* The Edit Modal */}
      <EditAssignmentModal
        isOpen={modalState.isOpen}
        tag={modalState.tag}
        day={selectedDay}
        currentPerson={modalState.currentPerson}
        personnel={personnel}
        onAssign={(fullName) =>
          editAssignment(selectedDay, modalState.tag, fullName)
        }
        onClear={() => clearAssignment(selectedDay, modalState.tag)}
        onClose={() =>
          setModalState({ isOpen: false, tag: "", currentPerson: "" })
        }
      />
    </div>
  );
}
