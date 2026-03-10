/* eslint-disable react-refresh/only-export-components */
import {
  JSX,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

/** schedule[dayNumber] = { tag: name, ... } — direct from Excel */
type Schedule = Record<string, Record<string, string>>;
type Edits = Record<string, string>;

interface RosterCache {
  templatePath: string | null;
  templateTags: string[];
  setTemplate: (path: string, tags: string[]) => void;
  clearTemplate: () => void;

  schedule: Schedule;
  tagDescriptions: Record<string, string>;
  availableDays: string[];
  setExcelData: (
    schedule: Schedule,
    tagDescriptions: Record<string, string>,
    dayNumbers: string[]
  ) => void;
  clearExcel: () => void;

  selectedDay: string;
  setSelectedDay: (day: string) => void;

  getDayAssignments: (day: string) => Record<string, string>;
  editAssignment: (day: string, tag: string, value: string) => void;
  clearAssignment: (day: string, tag: string) => void;

  getExportData: (
    fromDay: string,
    toDay: string
  ) => Record<string, Record<string, string>>;

  isReady: boolean;
}

const RosterContext = createContext<RosterCache | undefined>(undefined);

export function RosterProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [templatePath, setTemplatePath] = useState<string | null>(null);
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [tagDescriptions, setTagDescriptions] = useState<
    Record<string, string>
  >({});
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("1");
  const [edits, setEdits] = useState<Edits>({});

  const isReady = templatePath !== null && Object.keys(schedule).length > 0;

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
      newSchedule: Schedule,
      newDescriptions: Record<string, string>,
      dayNumbers: string[]
    ) => {
      setSchedule(newSchedule);
      setTagDescriptions(newDescriptions);
      setAvailableDays(dayNumbers);
      setEdits({});
      if (dayNumbers.length > 0) setSelectedDay(dayNumbers[0]);
    },
    []
  );

  const clearExcel = useCallback(() => {
    setSchedule({});
    setTagDescriptions({});
    setAvailableDays([]);
    setEdits({});
    setSelectedDay("1");
  }, []);

  /**
   * Build assignments for one day:
   * 1. Start with all template tags → ""
   * 2. Fill from Excel schedule
   * 3. Overlay manual edits
   */
  const getDayAssignments = useCallback(
    (day: string): Record<string, string> => {
      const result: Record<string, string> = {};

      // Initialize every template tag as empty string
      for (const tag of templateTags) {
        result[tag] = "";
      }

      // Fill from Excel
      const dayData = schedule[day];
      if (dayData) {
        for (const [tag, name] of Object.entries(dayData)) {
          if (tag in result) {
            result[tag] = name;
          }
        }
      }

      // Overlay edits
      for (const [key, value] of Object.entries(edits)) {
        const sep = key.indexOf("::");
        if (sep === -1) continue;
        const editDay = key.slice(0, sep);
        const editTag = key.slice(sep + 2);
        if (editDay === day && editTag in result) {
          result[editTag] = value;
        }
      }

      return result;
    },
    [templateTags, schedule, edits]
  );

  const editAssignment = useCallback(
    (day: string, tag: string, value: string) => {
      setEdits((prev) => ({ ...prev, [`${day}::${tag}`]: value }));
    },
    []
  );

  const clearAssignment = useCallback((day: string, tag: string) => {
    setEdits((prev) => ({ ...prev, [`${day}::${tag}`]: "" }));
  }, []);

  const getExportData = useCallback(
    (
      fromDay: string,
      toDay: string
    ): Record<string, Record<string, string>> => {
      const fromNum = Number(fromDay);
      const toNum = Number(toDay);
      const result: Record<string, Record<string, string>> = {};

      for (const day of availableDays) {
        const num = Number(day);
        if (num >= fromNum && num <= toNum) {
          result[day] = getDayAssignments(day);
        }
      }

      return result;
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
        schedule,
        tagDescriptions,
        availableDays,
        setExcelData,
        clearExcel,
        selectedDay,
        setSelectedDay,
        getDayAssignments,
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
