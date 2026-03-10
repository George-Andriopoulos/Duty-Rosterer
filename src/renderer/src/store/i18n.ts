export type Locale = "en" | "el";

interface Translations {
  appTitle: string;
  appSubtitle: string;
  wordTemplate: string;
  wordTemplateDesc: string;
  excelSchedule: string;
  excelScheduleDesc: string;
  tagsFound: (n: number) => string;
  daysLoaded: (d: number) => string;
  day: string;
  days: string;
  exportAll: (n: number) => string;
  exportDay: (d: string) => string;
  exportRange: (from: string, to: string) => string;
  exporting: string;
  from: string;
  to: string;
  noDataTitle: string;
  noDataDesc: string;
  positionsFilled: (f: number, t: number) => string;
  unfilled: (n: number) => string;
  tag: string;
  description: string;
  assignedPerson: string;
  edit: string;
  emptySlot: string;
  editAssignment: string;
  searchPlaceholder: string;
  noResults: string;
  current: string;
  clearAssignment: string;
  alertUploadTemplate: string;
  alertUploadExcel: string;
  alertNoData: string;
  alertExportOk: (count: number, dir: string) => string;
  alertExportFail: string;
}

const en: Translations = {
  appTitle: "Duty Rosterer",
  appSubtitle: "Template-driven roster generator",
  wordTemplate: "Word Template",
  wordTemplateDesc: "Select .docx with {tags} for each position",
  excelSchedule: "Excel Schedule",
  excelScheduleDesc: "Select .xlsx with position-based assignments",
  tagsFound: (n) => `${n} tags found`,
  daysLoaded: (d) => `${d} days loaded`,
  day: "Day",
  days: "days",
  exportAll: (n) => `Export All ${n} Days`,
  exportDay: (d) => `Export Day ${d}`,
  exportRange: (f, t) => `Export Days ${f}–${t}`,
  exporting: "Exporting...",
  from: "From:",
  to: "To:",
  noDataTitle: "No Data Yet",
  noDataDesc:
    "Upload a Word template and an Excel schedule above to start reviewing assignments.",
  positionsFilled: (f, t) => `${f} / ${t} positions filled`,
  unfilled: (n) => `${n} unfilled`,
  tag: "Tag",
  description: "Position",
  assignedPerson: "Assigned Person",
  edit: "Edit",
  emptySlot: "—",
  editAssignment: "Edit Assignment",
  searchPlaceholder: "Type a name...",
  noResults: "No match",
  current: "Current",
  clearAssignment: "Clear",
  alertUploadTemplate: "Please upload a Word template first.",
  alertUploadExcel: "Please upload an Excel schedule first.",
  alertNoData: "No days to export in the selected range.",
  alertExportOk: (c, d) =>
    `Done! ${c} document${c !== 1 ? "s" : ""} saved in:\n${d}`,
  alertExportFail: "Export failed: ",
};

const el: Translations = {
  appTitle: "Duty Rosterer",
  appSubtitle: "Δημιουργία υπηρεσιών με βάση πρότυπο",
  wordTemplate: "Πρότυπο Word",
  wordTemplateDesc: "Επιλέξτε .docx με {tags} σε κάθε θέση",
  excelSchedule: "Πρόγραμμα Excel",
  excelScheduleDesc: "Επιλέξτε .xlsx με αναθέσεις ανά θέση",
  tagsFound: (n) => `${n} tags βρέθηκαν`,
  daysLoaded: (d) => `${d} ημέρες`,
  day: "Ημέρα",
  days: "ημέρες",
  exportAll: (n) => `Εξαγωγή ${n} Ημερών`,
  exportDay: (d) => `Εξαγωγή Ημέρας ${d}`,
  exportRange: (f, t) => `Εξαγωγή ${f}–${t}`,
  exporting: "Εξαγωγή...",
  from: "Από:",
  to: "Έως:",
  noDataTitle: "Δεν υπάρχουν δεδομένα",
  noDataDesc: "Ανεβάστε πρότυπο Word και πρόγραμμα Excel για να ξεκινήσετε.",
  positionsFilled: (f, t) => `${f} / ${t} θέσεις καλυμμένες`,
  unfilled: (n) => `${n} κενές`,
  tag: "Tag",
  description: "Θέση",
  assignedPerson: "Πρόσωπο",
  edit: "Επεξ.",
  emptySlot: "—",
  editAssignment: "Επεξεργασία",
  searchPlaceholder: "Πληκτρολογήστε όνομα...",
  noResults: "Χωρίς αποτέλεσμα",
  current: "Τρέχων",
  clearAssignment: "Αφαίρεση",
  alertUploadTemplate: "Ανεβάστε πρώτα ένα πρότυπο Word.",
  alertUploadExcel: "Ανεβάστε πρώτα ένα πρόγραμμα Excel.",
  alertNoData: "Δεν υπάρχουν ημέρες στο επιλεγμένο εύρος.",
  alertExportOk: (c, d) => `Ολοκληρώθηκε! ${c} έγγραφα στο:\n${d}`,
  alertExportFail: "Αποτυχία: ",
};

const translations: Record<Locale, Translations> = { en, el };

export function t(locale: Locale): Translations {
  return translations[locale];
}
