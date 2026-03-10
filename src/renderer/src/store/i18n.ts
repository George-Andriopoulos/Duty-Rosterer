export type Locale = "en" | "el";

interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;

  // Upload zones
  wordTemplate: string;
  wordTemplateDesc: string;
  excelSchedule: string;
  excelScheduleDesc: string;
  tagsFound: (n: number) => string;
  personnelDays: (p: number, d: number) => string;

  // Day navigator
  day: string;
  days: string;

  // Export
  exportAll: (n: number) => string;
  exportDay: (d: number) => string;
  exportDays: (from: number, to: number) => string;
  exporting: string;
  from: string;
  to: string;

  // Review table
  noDataTitle: string;
  noDataDesc: string;
  positionsFilled: (filled: number, total: number) => string;
  unfilled: (n: number) => string;
  templateTag: string;
  assignedPerson: string;
  edit: string;
  unfilledLabel: string;

  // Edit modal
  editAssignment: string;
  searchPersonnel: string;
  noPersonnelFound: string;
  current: string;
  clearAssignment: string;

  // Unmatched warning
  unmatchedTitle: (n: number) => string;
  unmatchedDesc: string;

  // Alerts
  alertUploadTemplate: string;
  alertUploadExcel: string;
  alertNoData: string;
  alertExportSuccess: (count: number, dir: string) => string;
  alertExportFail: string;
  alertDocxOnly: string;
}

const en: Translations = {
  appTitle: "Duty Rosterer",
  appSubtitle: "Template-driven roster generator",
  wordTemplate: "Word Template",
  wordTemplateDesc: "Select .docx with {tags} for each position",
  excelSchedule: "Excel Schedule",
  excelScheduleDesc: "Select .xlsx with personnel assignments",
  tagsFound: (n) => `${n} tags found`,
  personnelDays: (p, d) => `${p} personnel · ${d} days`,
  day: "Day",
  days: "days",
  exportAll: (n) => `Export All ${n} Days`,
  exportDay: (d) => `Export Day ${d}`,
  exportDays: (from, to) => `Export Days ${from}–${to}`,
  exporting: "Exporting...",
  from: "From:",
  to: "To:",
  noDataTitle: "No Data Yet",
  noDataDesc:
    "Upload a Word template and an Excel schedule above to start reviewing assignments.",
  positionsFilled: (f, t) => `${f} / ${t} positions filled`,
  unfilled: (n) => `${n} unfilled`,
  templateTag: "Template Tag",
  assignedPerson: "Assigned Person",
  edit: "Edit",
  unfilledLabel: "— Unfilled —",
  editAssignment: "Edit Assignment",
  searchPersonnel: "Search personnel...",
  noPersonnelFound: "No personnel found",
  current: "Current",
  clearAssignment: "Clear Assignment",
  unmatchedTitle: (n) => `Unmatched Assignments (${n})`,
  unmatchedDesc:
    "These people have a tag in the Excel that doesn't match any tag in your Word template:",
  alertUploadTemplate: "Please upload a Word template first.",
  alertUploadExcel: "Please upload an Excel schedule first.",
  alertNoData: "No days to export in the selected range.",
  alertExportSuccess: (count, dir) =>
    `Done! Generated ${count} document${count !== 1 ? "s" : ""} in:\n${dir}`,
  alertExportFail: "Export failed: ",
  alertDocxOnly:
    "Only .docx files are supported. Please open your .doc file in Word or LibreOffice and Save As → Word 2010-365 (.docx).",
};

const el: Translations = {
  appTitle: "Duty Rosterer",
  appSubtitle: "Δημιουργία υπηρεσιών με βάση πρότυπο",
  wordTemplate: "Πρότυπο Word",
  wordTemplateDesc: "Επιλέξτε .docx με {tags} σε κάθε θέση",
  excelSchedule: "Πρόγραμμα Excel",
  excelScheduleDesc: "Επιλέξτε .xlsx με τις αναθέσεις προσωπικού",
  tagsFound: (n) => `${n} tags βρέθηκαν`,
  personnelDays: (p, d) => `${p} άτομα · ${d} ημέρες`,
  day: "Ημέρα",
  days: "ημέρες",
  exportAll: (n) => `Εξαγωγή ${n} Ημερών`,
  exportDay: (d) => `Εξαγωγή Ημέρας ${d}`,
  exportDays: (from, to) => `Εξαγωγή Ημερών ${from}–${to}`,
  exporting: "Εξαγωγή...",
  from: "Από:",
  to: "Έως:",
  noDataTitle: "Δεν υπάρχουν δεδομένα",
  noDataDesc:
    "Ανεβάστε ένα πρότυπο Word και ένα πρόγραμμα Excel για να ξεκινήσετε τον έλεγχο.",
  positionsFilled: (f, t) => `${f} / ${t} θέσεις καλυμμένες`,
  unfilled: (n) => `${n} κενές`,
  templateTag: "Tag Προτύπου",
  assignedPerson: "Ανατεθειμένο Πρόσωπο",
  edit: "Επεξ.",
  unfilledLabel: "— Κενή —",
  editAssignment: "Επεξεργασία Ανάθεσης",
  searchPersonnel: "Αναζήτηση προσωπικού...",
  noPersonnelFound: "Δεν βρέθηκε προσωπικό",
  current: "Τρέχων",
  clearAssignment: "Αφαίρεση Ανάθεσης",
  unmatchedTitle: (n) => `Μη αντιστοιχισμένες αναθέσεις (${n})`,
  unmatchedDesc:
    "Αυτά τα άτομα έχουν tag στο Excel που δεν αντιστοιχεί σε κανένα tag του Word:",
  alertUploadTemplate: "Παρακαλώ ανεβάστε πρώτα ένα πρότυπο Word.",
  alertUploadExcel: "Παρακαλώ ανεβάστε πρώτα ένα πρόγραμμα Excel.",
  alertNoData: "Δεν υπάρχουν ημέρες για εξαγωγή στο επιλεγμένο εύρος.",
  alertExportSuccess: (count, dir) =>
    `Ολοκληρώθηκε! Δημιουργήθηκαν ${count} έγγραφα στο:\n${dir}`,
  alertExportFail: "Αποτυχία εξαγωγής: ",
  alertDocxOnly:
    "Μόνο αρχεία .docx υποστηρίζονται. Ανοίξτε το .doc αρχείο σας στο Word ή LibreOffice και κάντε Αποθήκευση ως → Word 2010-365 (.docx).",
};

const translations: Record<Locale, Translations> = { en, el };

export function t(locale: Locale): Translations {
  return translations[locale];
}
