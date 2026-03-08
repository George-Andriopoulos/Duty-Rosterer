import { JSX } from "react";

import { useRosterCache } from "../store/RosterContext";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number | null;
  shiftId: string | null;
}

export function AssignmentModal({
  isOpen,
  onClose,
  day,
  shiftId,
}: AssignmentModalProps): JSX.Element | null {
  const { personnel, assignShift } = useRosterCache();

  if (!isOpen || day === null || shiftId === null) return null;

  return (
    // The dark backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* STRICT DESIGN: Pure #FFFFFF overlay, no accent colors */}
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-[#FFFFFF] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-bold text-black">Assign Officer</h3>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="bg-[#FFFFFF] p-4">
          <p className="mb-4 text-sm font-medium text-gray-600">
            Select personnel for Day {day}
          </p>

          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto pr-1">
            {personnel.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  assignShift(day, shiftId, p.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded border border-gray-300 bg-[#FFFFFF] p-3 text-left transition-colors hover:bg-gray-100"
              >
                <span className="font-semibold text-black">
                  {p.rank} {p.name}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {p.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
