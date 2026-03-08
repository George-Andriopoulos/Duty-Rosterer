/* eslint-disable react-refresh/only-export-components */
import { JSX, ReactNode, createContext, useContext, useState } from "react";

export type Personnel = {
  id: string;
  name: string;
  rank: string;
  status: "AVAILABLE" | "ON_LEAVE" | "DAY_OFF";
};

export type ShiftAssignment = {
  day: number;
  shiftId: string;
  personnelId: string | null;
};

// 2. Define the Cache structure
interface RosterCache {
  personnel: Personnel[];
  assignments: ShiftAssignment[];
  assignShift: (day: number, shiftId: string, personnelId: string) => void;
}

const RosterContext = createContext<RosterCache | undefined>(undefined);

export function RosterProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // Mock data for our initial build
  const [personnel] = useState<Personnel[]>([
    { id: "p1", name: "ΣΤΑΘΟΠΟΥΛΟΣ", rank: "Α/Δ'", status: "AVAILABLE" },
    { id: "p2", name: "ΠΑΤΑΚΑΣ", rank: "Υ/Β'", status: "ON_LEAVE" },
    { id: "p3", name: "ΔΑΣΚΑΛΟΣ", rank: "ΑΡΧ.", status: "AVAILABLE" },
  ]);

  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);

  const assignShift = (
    day: number,
    shiftId: string,
    personnelId: string
  ): void => {
    setAssignments((prev) => {
      const filtered = prev.filter(
        (a) => !(a.day === day && a.shiftId === shiftId)
      );
      return [...filtered, { day, shiftId, personnelId }];
    });
  };

  return (
    <RosterContext.Provider value={{ personnel, assignments, assignShift }}>
      {children}
    </RosterContext.Provider>
  );
}

export const useRosterCache = (): RosterCache => {
  const context = useContext(RosterContext);
  if (!context)
    throw new Error("useRosterCache must be used within RosterProvider");
  return context;
};
