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
  fullName: string; // "RANK NAME"
}

/**
 * schedule: Maps "RANK NAME" → { "1": "tag_name", "2": "tag_name", ... }
 * This comes straight from the Excel file.
 */
type Schedule = Record<string, Record<string, string>>;

/**
 * Manual edits overlay. Keyed by "day::tag" → fullName (or "" to clear).
 * These override whatever the Excel says for that day+tag combo.
 */
type Edits = Record<string, string>;

// ── Context shape ──────────────────────────────────────

interface RosterCache {
  // Template state
  templatePath: string | null;
  templateTags: string[];
  setTemplate: (path: string, tags: string[]) => void;

  // Excel state
  personnel: PersonnelEntry[];
  schedule: Schedule;
  totalDays: number;
  setExcelData: (
    personnel: Array<{ name: string; rank: string }>,
    schedule: Schedule,
    totalDays: number
  ) => void;

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

  // Export
  getExportData: () => Record<string, Record<string, string>>;

  // Status helpers
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
  const [totalDays, setTotalDays] = useState(31);
  const [selectedDay, setSelectedDay] = useState(1);
  const [edits, setEdits] = useState<Edits>({});

  const isReady = templatePath !== null && personnel.length > 0;

  const setTemplate = useCallback((path: string, tags: string[]) => {
    setTemplatePath(path);
    setTemplateTags(tags);
    setEdits({}); // Reset edits when template changes
  }, []);

  const setExcelData = useCallback(
    (
      rawPersonnel: Array<{ name: string; rank: string }>,
      newSchedule: Schedule,
      days: number
    ) => {
      const entries: PersonnelEntry[] = rawPersonnel.map((p) => ({
        name: p.name,
        rank: p.rank,
        fullName: p.rank ? `${p.rank} ${p.name}` : p.name,
      }));
      setPersonnel(entries);
      setSchedule(newSchedule);
      setTotalDays(days);
      setEdits({}); // Reset edits when Excel changes
    },
    []
  );

  /**
   * Builds the assignment map for one day:
   * 1. Start with all template tags → ""
   * 2. Walk every person's schedule; if their tag for this day exists in the template, place them
   * 3. Overlay any manual edits
   */
  const getDayAssignments = useCallback(
    (day: number): Record<string, string> => {
      const result: Record<string, string> = {};

      // Initialize every template tag as empty
      for (const tag of templateTags) {
        result[tag] = "";
      }

      // Fill from Excel schedule
      const dayStr = String(day);
      for (const [fullName, personSchedule] of Object.entries(schedule)) {
        const tag = personSchedule[dayStr];
        if (tag && tag in result) {
          result[tag] = fullName;
        }
      }

      // Overlay manual edits for this day
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

  /**
   * Find people who have a tag assignment for this day in the Excel
   * but that tag does NOT exist in the template. These are "orphaned" assignments.
   */
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

  /**
   * Build the full export payload: one filled tag-map per day.
   * Unfilled tags get empty string (docxtemplater will just leave them blank).
   */
  const getExportData = useCallback((): Record<
    string,
    Record<string, string>
  > => {
    const dayDataMap: Record<string, Record<string, string>> = {};
    for (let d = 1; d <= totalDays; d++) {
      dayDataMap[String(d)] = getDayAssignments(d);
    }
    return dayDataMap;
  }, [totalDays, getDayAssignments]);

  return (
    <RosterContext.Provider
      value={{
        templatePath,
        templateTags,
        setTemplate,
        personnel,
        schedule,
        totalDays,
        setExcelData,
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
