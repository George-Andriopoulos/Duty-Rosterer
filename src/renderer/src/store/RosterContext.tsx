/* eslint-disable react-refresh/only-export-components */
import {
  JSX,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

// ── Types ──────────────────────────────────────────────

export interface PersonnelEntry {
  name: string;
  rank: string;
  fullName: string;
}

type Schedule = Record<string, Record<string, string>>;
type Edits = Record<string, string>;

// ── Context shape ──────────────────────────────────────

interface RosterCache {
  // Template state
  templatePath: string | null;
  templateTags: string[];
  setTemplate: (path: string, tags: string[]) => void;
  clearTemplate: () => void;

  // Excel state
  personnel: PersonnelEntry[];
  schedule: Schedule;
  /** The actual day numbers found in the Excel (e.g. [1,2,3,4,5]) */
  availableDays: number[];
  setExcelData: (
    personnel: Array<{ name: string; rank: string }>,
    schedule: Schedule,
    dayNumbers: number[]
  ) => void;
  clearExcel: () => void;

  // Navigation
  selectedDay: number;
  setSelectedDay: (day: number) => void;

  // Per-day data
  getDayAssignments: (day: number) => Record<string, string>;
  getUnmatchedPersonnel: (
    day: number
  ) => Array<{ fullName: string; tag: string }>;

  // Editing
  editAssignment: (day: number, tag: string, fullName: string) => void;
  clearAssignment: (day: number, tag: string) => void;

  // Export — now accepts a range
  getExportData: (
    fromDay: number,
    toDay: number
  ) => Record<string, Record<string, string>>;

  // Status
  isReady: boolean;
}

const RosterContext = createContext<RosterCache | undefined>(undefined);

// ── Provider ───────────────────────────────────────────

export function RosterProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [templatePath, setTemplatePath] = useState<string | null>(null);
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [personnel, setPersonnel] = useState<PersonnelEntry[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [edits, setEdits] = useState<Edits>({});

  const isReady = templatePath !== null && personnel.length > 0;

  const setTemplate = useCallback((path: string, tags: string[]) => {
    setTemplatePath(path);
    setTemplateTags(tags);
    setEdits({});
  }, []);

  const clearTemplate = useCallback(() => {
    setTemplatePath(null);
    setTemplateTags([]);
    setEdits({});
  }, []);

  const setExcelData = useCallback(
    (
      rawPersonnel: Array<{ name: string; rank: string }>,
      newSchedule: Schedule,
      dayNumbers: number[]
    ) => {
      const entries: PersonnelEntry[] = rawPersonnel.map((p) => ({
        name: p.name,
        rank: p.rank,
        fullName: p.rank ? `${p.rank} ${p.name}` : p.name,
      }));
      setPersonnel(entries);
      setSchedule(newSchedule);
      setAvailableDays(dayNumbers);
      setEdits({});

      // Auto-select the first available day
      if (dayNumbers.length > 0) {
        setSelectedDay(dayNumbers[0]);
      }
    },
    []
  );

  const clearExcel = useCallback(() => {
    setPersonnel([]);
    setSchedule({});
    setAvailableDays([]);
    setEdits({});
    setSelectedDay(1);
  }, []);

  const getDayAssignments = useCallback(
    (day: number): Record<string, string> => {
      const result: Record<string, string> = {};

      for (const tag of templateTags) {
        result[tag] = "";
      }

      const dayStr = String(day);
      for (const [fullName, personSchedule] of Object.entries(schedule)) {
        const tag = personSchedule[dayStr];
        if (tag && tag in result) {
          result[tag] = fullName;
        }
      }

      for (const [key, fullName] of Object.entries(edits)) {
        const separatorIdx = key.indexOf("::");
        if (separatorIdx === -1) continue;
        const editDay = key.slice(0, separatorIdx);
        const editTag = key.slice(separatorIdx + 2);
        if (editDay === dayStr && editTag in result) {
          result[editTag] = fullName;
        }
      }

      return result;
    },
    [templateTags, schedule, edits]
  );

  const getUnmatchedPersonnel = useCallback(
    (day: number): Array<{ fullName: string; tag: string }> => {
      const dayStr = String(day);
      const tagSet = new Set(templateTags);
      const unmatched: Array<{ fullName: string; tag: string }> = [];

      for (const [fullName, personSchedule] of Object.entries(schedule)) {
        const tag = personSchedule[dayStr];
        if (tag && !tagSet.has(tag)) {
          unmatched.push({ fullName, tag });
        }
      }

      return unmatched;
    },
    [templateTags, schedule]
  );

  const editAssignment = useCallback(
    (day: number, tag: string, fullName: string) => {
      setEdits((prev) => ({ ...prev, [`${day}::${tag}`]: fullName }));
    },
    []
  );

  const clearAssignment = useCallback((day: number, tag: string) => {
    setEdits((prev) => ({ ...prev, [`${day}::${tag}`]: "" }));
  }, []);

  const getExportData = useCallback(
    (
      fromDay: number,
      toDay: number
    ): Record<string, Record<string, string>> => {
      const dayDataMap: Record<string, Record<string, string>> = {};

      // Only export days that actually exist in the Excel
      for (const day of availableDays) {
        if (day >= fromDay && day <= toDay) {
          dayDataMap[String(day)] = getDayAssignments(day);
        }
      }

      return dayDataMap;
    },
    [availableDays, getDayAssignments]
  );

  return (
    <RosterContext.Provider
      value={{
        templatePath,
        templateTags,
        setTemplate,
        clearTemplate,
        personnel,
        schedule,
        availableDays,
        setExcelData,
        clearExcel,
        selectedDay,
        setSelectedDay,
        getDayAssignments,
        getUnmatchedPersonnel,
        editAssignment,
        clearAssignment,
        getExportData,
        isReady,
      }}
    >
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
