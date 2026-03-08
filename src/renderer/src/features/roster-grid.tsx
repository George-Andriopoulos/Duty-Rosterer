import { JSX, useMemo, useState } from "react";

import { ShiftAssignment, useRosterCache } from "../store/RosterContext";
import { AssignmentModal } from "./assignment-modal";

// <-- Import the modal

// Define the core shifts based on your official layout photo
const SHIFT_COLUMNS = [
  { id: "s_axiomatikos", label: "ΑΞΙΩΜ. ΥΠΗΡΕΣΙΑΣ" },
  { id: "s_kentro", label: "ΚΕΝΤΡΟ R/T" },
  { id: "s_skopos", label: "ΣΚΟΠΟΣ ΠΥΛΗΣ" },
  { id: "s_ypaspistirio", label: "ΥΠΑΣΠΙΣΤΗΡΙΟ" },
];

const DAYS_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

export function RosterGrid(): JSX.Element {
  const { personnel, assignments } = useRosterCache();

  // State to control our pure white modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    day: number | null;
    shiftId: string | null;
  }>({
    isOpen: false,
    day: null,
    shiftId: null,
  });

  // HIGH-PERFORMANCE OPTIMIZATION:
  // We create an O(1) lookup map so 150+ cells don't have to run .find() on every render.
  // The map key is "day-shiftId" (e.g., "5-s_kentro")
  const assignmentMap = useMemo(() => {
    const map = new Map<string, string>();
    assignments.forEach((a: ShiftAssignment) => {
      if (a.personnelId) {
        map.set(`${a.day}-${a.shiftId}`, a.personnelId);
      }
    });
    return map;
  }, [assignments]);

  // Helper to get the person's name from their ID
  const getPersonnelName = (id: string): string => {
    const person = personnel.find((p) => p.id === id);
    return person ? `${person.rank} ${person.name}` : "";
  };

  return (
    <div className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-sm">
          {/* STICKY HEADER: Stays at the top when scrolling down the days */}
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm dark:bg-slate-800">
            <tr>
              <th className="border-border text-main w-16 border-r border-b p-3 text-center font-bold">
                Day
              </th>
              {SHIFT_COLUMNS.map((shift) => (
                <th
                  key={shift.id}
                  className="border-border text-main border-r border-b p-3 font-bold"
                >
                  {shift.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* GRID BODY */}
          <tbody>
            {DAYS_IN_MONTH.map((day) => (
              <tr
                key={day}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                {/* Day Number Column */}
                <td className="border-border text-muted border-r border-b bg-slate-50/50 p-3 text-center font-semibold dark:bg-slate-800/20">
                  {day}
                </td>

                {/* Shift Assignment Cells */}
                {SHIFT_COLUMNS.map((shift) => {
                  const cellKey = `${day}-${shift.id}`;
                  const assignedPersonnelId = assignmentMap.get(cellKey);
                  const isAssigned = !!assignedPersonnelId;

                  return (
                    <td
                      key={cellKey}
                      className="border-border border-r border-b p-0"
                    >
                      {/* Interactive Cell Wrapper */}
                      <button
                        onClick={() => {
                          // Open the modal with the specific day and shift
                          setModalState({
                            isOpen: true,
                            day,
                            shiftId: shift.id,
                          });
                        }}
                        className={`block h-full w-full p-3 text-left transition-all ${
                          isAssigned
                            ? "bg-blue-50 font-semibold text-blue-900 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-100 dark:hover:bg-blue-900/50"
                            : "text-muted hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {isAssigned
                          ? getPersonnelName(assignedPersonnelId)
                          : "+ Assign"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the modal at the bottom of the component */}
      <AssignmentModal
        isOpen={modalState.isOpen}
        day={modalState.day}
        shiftId={modalState.shiftId}
        onClose={() =>
          setModalState({ isOpen: false, day: null, shiftId: null })
        }
      />
    </div>
  );
}
