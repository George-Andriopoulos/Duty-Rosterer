# Duty Rosterer

Εφαρμογή αυτόματης δημιουργίας ημερήσιων πινάκων υπηρεσίας | Automated daily duty roster generator

---

# 🇬🇷 Οδηγός Χρήσης

## Τι Κάνει η Εφαρμογή

Το Duty Rosterer είναι μια desktop εφαρμογή που δημιουργεί αυτόματα ημερήσια έγγραφα υπηρεσίας. Χρειάζεστε δύο αρχεία:

1. **Ένα πρότυπο Word** (.docx) — η επίσημη διάταξη υπηρεσίας με ειδικά tags εκεί που πρέπει να εμφανίζονται τα ονόματα
2. **Ένα πρόγραμμα Excel** (.xlsx) — ένα φύλλο εργασίας που δείχνει ποιος είναι σε ποια θέση κάθε ημέρα

Η εφαρμογή διαβάζει και τα δύο αρχεία, σας επιτρέπει να ελέγξετε και να τροποποιήσετε τις αναθέσεις ημέρα-ημέρα, και στη συνέχεια εξάγει συμπληρωμένα έγγραφα Word — ένα ανά ημέρα — έτοιμα για εκτύπωση.

---

## Βήμα 1: Προετοιμασία του Word Template

Ανοίξτε το υπάρχον έγγραφο υπηρεσίας σας στο Microsoft Word (ή LibreOffice Writer). Παντού που πρέπει να εμφανίζεται ένα όνομα, αντικαταστήστε το με ένα **tag** σε αγκύλες.

### Τι είναι ένα tag;

Ένα tag είναι ένα σύντομο αναγνωριστικό μέσα σε `{` και `}`. Για παράδειγμα: `{kentro_rt_06}`

Όταν η εφαρμογή δημιουργεί το τελικό έγγραφο, αντικαθιστά το `{kentro_rt_06}` με όποιο όνομα είναι ανατεθειμένο σε αυτή τη θέση στο Excel.

### Παράδειγμα — Πριν και Μετά

**Πριν (αρχικό έγγραφο):**

| ΚΕΝΤΡΟ R/T | ΩΡΕΣ |
|---|---|
| ΑΡΧ. ΠΑΠΠΑΣ | 06:00-14:00 |
| ΑΡΧ. ΝΙΚΟΥ | 14:00-22:00 |
| ΑΡΧ. ΒΛΑΧΟΥ | 22:00-06:00 |

**Μετά (template με tags):**

| ΚΕΝΤΡΟ R/T | ΩΡΕΣ |
|---|---|
| {kentro_rt_06} | 06:00-14:00 |
| {kentro_rt_14} | 14:00-22:00 |
| {kentro_rt_22} | 22:00-06:00 |

### Κανόνες για τα tags

- Χρησιμοποιήστε μόνο αγγλικά γράμματα, αριθμούς και κάτω παύλες: `a-z`, `0-9`, `_`
- Χωρίς κενά, χωρίς ελληνικούς χαρακτήρες μέσα στο tag
- Κάθε tag πρέπει να είναι μοναδικό — αν έχετε 5 θέσεις για "ΚΑΝΟΝΙΚΗ ΑΔΕΙΑ", χρησιμοποιήστε `{kanonikh_1}`, `{kanonikh_2}`, κλπ.
- Tags για μεταδεδομένα όπως ημερομηνίες λειτουργούν επίσης: αντικαταστήστε `21-07-2025` με `{date}` και `ΔΕΥΤΕΡΑ` με `{hmera}`
- Κενές θέσεις (κανείς δεν αναλαμβάνει εκείνη την ημέρα) θα εμφανίζονται κενές στο τελικό έγγραφο

### Προτεινόμενα ονόματα tags

| Θέση | Προτεινόμενο Tag |
|---|---|
| Διευθυντής | `{dieythyntis}` |
| Υποδιευθυντής | `{ypodieythyntis}` |
| Ημερομηνία | `{date}` |
| Ημέρα εβδομάδας | `{hmera}` |
| Κανονική Άδεια θέση 1 | `{kanonikh_1}` |
| Κανονική Άδεια θέση 2 | `{kanonikh_2}` |
| Ημερήσια Ανάπαυση θέση 1 | `{hmerisia_1}` |
| ΚΕΝΤΡΟ R/T πρωινό | `{kentro_rt_06}` |
| ΚΕΝΤΡΟ R/T απογευματινό | `{kentro_rt_14}` |
| ΚΕΝΤΡΟ R/T νυχτερινό | `{kentro_rt_22}` |
| ΣΚΟΠΟΣ ΠΥΛΗΣ απογευματινό | `{skopos_14}` |
| ΔΙ.ΑΣ. πρωί θέση 1 | `{dias_prwi_1}` |

Μπορείτε να χρησιμοποιήσετε όποια ονόματα θέλετε — αρκεί να ταιριάζουν μεταξύ Word και Excel.

### Σημαντικό

- Αποθηκεύστε το αρχείο ως **.docx** (Έγγραφο Word 2010-365), ΟΧΙ .doc
- Η εφαρμογή δεν μπορεί να διαβάσει αρχεία παλιού τύπου .doc

---

## Βήμα 2: Προετοιμασία του Excel

Δημιουργήστε ένα νέο αρχείο Excel (.xlsx) με αυτή τη δομή:

### Δομή

| TAG | ΠΕΡΙΓΡΑΦΗ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| date | Ημερομηνία | 21-07-2025 | 22-07-2025 | 23-07-2025 | 24-07-2025 | 25-07-2025 |
| hmera | Ημέρα | ΔΕΥΤΕΡΑ | ΤΡΙΤΗ | ΤΕΤΑΡΤΗ | ΠΕΜΠΤΗ | ΠΑΡΑΣΚΕΥΗ |
| dieythyntis | Διευθυντής | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ |
| kanonikh_1 | Κανονική Άδεια #1 | ΑΡΧ. ΤΖΑΝΕΤΟΣ | ΑΡΧ. ΤΖΑΝΕΤΟΣ | ΑΡΧ. ΤΖΑΝΕΤΟΣ | | |
| hmerisia_1 | Ημ. Ανάπαυση #1 | Π.Υ. ΖΕΡΒΑΣ | | Π.Υ. ΖΕΡΒΑΣ | | |
| kentro_rt_06 | ΚΕΝΤΡΟ R/T 06-14 | ΑΡΧ. ΠΑΠΠΑΣ | ΑΡΧ. ΒΛΑΧΟΥ | ΑΡΧ. ΝΙΚΟΥ | ΑΡΧ. ΠΑΠΠΑΣ | ΑΡΧ. ΒΛΑΧΟΥ |
| kentro_rt_14 | ΚΕΝΤΡΟ R/T 14-22 | ΑΡΧ. ΝΙΚΟΥ | ΥΠΑΡΧ. ΡΗΓΑΣ | ΑΡΧ. ΒΛΑΧΟΥ | | ΑΡΧ. ΝΙΚΟΥ |
| kentro_rt_22 | ΚΕΝΤΡΟ R/T 22-06 | ΑΡΧ. ΒΛΑΧΟΥ | ΑΡΧ. ΝΙΚΟΥ | ΑΡΧ. ΠΑΠΠΑΣ | ΑΡΧ. ΒΛΑΧΟΥ | ΥΠΑΡΧ. ΡΗΓΑΣ |
| skopos_14 | ΣΚΟΠΟΣ 14-22 | ΑΡΧ. ΔΕΛΗΣ | ΑΡΧ. ΜΠΟΥΡΑΣ | | Π.Υ. ΖΕΡΒΑΣ | ΑΡΧ. ΜΠΟΥΡΑΣ |

### Ανάλυση στηλών

- **Στήλη A (TAG):** Το ακριβές όνομα tag, όπως ακριβώς εμφανίζεται στο Word (χωρίς τις αγκύλες)
- **Στήλη B (ΠΕΡΙΓΡΑΦΗ):** Μια περιγραφή για δική σας αναφορά — εμφανίζεται στην οθόνη ελέγχου
- **Στήλες C και μετά (1, 2, 3...):** Αριθμοί ημερών. Κάθε κελί περιέχει το όνομα του ατόμου που αναλαμβάνει τη θέση εκείνη την ημέρα

### Κανόνες

- Αν μια θέση είναι κενή κάποια ημέρα, αφήστε το κελί κενό
- Ο αριθμός στηλών ημερών καθορίζει πόσες ημέρες θα επεξεργαστεί η εφαρμογή — βάλτε μόνο τις ημέρες που χρειάζεστε (5, 7, 30, 31, ό,τι θέλετε)
- Τα ονόματα tag στη Στήλη A πρέπει να ταιριάζουν ακριβώς με τα tags στο Word
- Μπορείτε να προσθέσετε γραμμές-τίτλους κατηγοριών (αφήστε τη Στήλη A κενή) — η εφαρμογή θα τις αγνοήσει

---

## Βήμα 3: Χρήση της Εφαρμογής

1. **Εκκίνηση** — θα δείτε δύο ζώνες ανεβάσματος στο πάνω μέρος
2. **Ανεβάστε το Word template** — κάντε κλικ στη ζώνη "Πρότυπο Word", επιλέξτε το .docx αρχείο. Η εφαρμογή το σαρώνει και αναφέρει πόσα tags βρήκε.
3. **Ανεβάστε το Excel** — κάντε κλικ στη ζώνη "Πρόγραμμα Excel", επιλέξτε το .xlsx αρχείο. Η εφαρμογή αναφέρει πόσες ημέρες φορτώθηκαν.
4. **Έλεγχος αναθέσεων** — πλοηγηθείτε ημέρα-ημέρα χρησιμοποιώντας τα βέλη ή το dropdown. Κάθε γραμμή δείχνει μια θέση και ποιος είναι ανατεθειμένος.
5. **Επεξεργασία** — κάντε κλικ στο εικονίδιο μολυβιού δίπλα σε οποιαδήποτε γραμμή για να πληκτρολογήσετε διαφορετικό όνομα. Enter για αποθήκευση, Escape για ακύρωση.
6. **Εξαγωγή** — επιλέξτε εύρος ημερών (Από / Έως) και πατήστε Εξαγωγή. Η εφαρμογή ζητά φάκελο αποθήκευσης και δημιουργεί ένα .docx ανά ημέρα.

### Εναλλαγή γλώσσας

Πατήστε "🇬🇧 EN" ή "🇬🇷 ΕΛ" πάνω δεξιά για εναλλαγή μεταξύ Αγγλικών και Ελληνικών. Προεπιλογή: Ελληνικά.

### Σκοτεινό θέμα

Πατήστε 🌙 / ☀️ για εναλλαγή φωτεινού/σκοτεινού θέματος.

### Εκκαθάριση αρχείων

Κάθε ζώνη ανεβάσματος εμφανίζει ένα ✕ όταν είναι φορτωμένο αρχείο. Πατήστε το για εκκαθάριση και εκ νέου επιλογή.

---

## Αποτέλεσμα Εξαγωγής

Η εφαρμογή δημιουργεί αρχεία:

```
Duty_Roster_Day_01.docx
Duty_Roster_Day_02.docx
Duty_Roster_Day_03.docx
...
```

Κάθε αρχείο είναι αντίγραφο του template σας με όλα τα `{tags}` αντικατεστημένα με τα αντίστοιχα ονόματα. Η μορφοποίηση, οι γραμματοσειρές και η διάταξη διατηρούνται ακριβώς.

---

## Συμβουλές

- **Για συναδέλφους με διαφορετικά templates:** Αρκεί να φτιάξουν το δικό τους Word template με τα δικά τους tags και ένα αντίστοιχο Excel. Καμία αλλαγή στον κώδικα.
- **Επαναχρησιμοποίηση Excel:** Κάθε μήνα, αντιγράψτε το Excel και ενημερώστε τα ονόματα. Τα tags και η δομή μένουν ίδια.
- **Γραμματοσειρά:** Το εξαγόμενο έγγραφο χρησιμοποιεί όποια γραμματοσειρά είχε πληκτρολογηθεί το `{tag}` στο Word template.

---

## Ανάπτυξη & Διανομή

```bash
# Εκτέλεση σε λειτουργία ανάπτυξης
npm run dev

# Κατασκευή παραγωγής
npm run build

# Δημιουργία .exe για Windows
npx electron-builder --win

# Τα αρχεία βρίσκονται στον φάκελο dist/
```

Το αποτέλεσμα είναι ένα `.exe` αρχείο που μπορεί να τρέξει οποιοσδήποτε χωρίς εγκατάσταση Node.js ή άλλων εργαλείων.

---
---

# 🇬🇧 User Guide

## What This App Does

Duty Rosterer is a desktop application that automatically generates daily duty roster documents. You provide two files:

1. **A Word template** (.docx) — the official duty sheet layout with placeholder tags where names should appear
2. **An Excel schedule** (.xlsx) — a spreadsheet listing who is assigned to which position on each day

The app reads both files, lets you review and edit assignments day by day, then exports filled Word documents — one per day — ready to print or distribute.

---

## Step 1: Prepare the Word Template

Open your existing duty roster document in Microsoft Word (or LibreOffice Writer). Everywhere a person's name should go, replace it with a **tag** in curly braces.

### What is a tag?

A tag is a short identifier surrounded by `{` and `}`. For example: `{kentro_rt_06}`

When the app generates the final document, it replaces `{kentro_rt_06}` with whatever name is assigned to that position in the Excel file.

### Example — Before and After

**Before (original document):**

| ΚΕΝΤΡΟ R/T | ΩΡΕΣ |
|---|---|
| ΑΡΧ. ΠΑΠΠΑΣ | 06:00-14:00 |
| ΑΡΧ. ΝΙΚΟΥ | 14:00-22:00 |
| ΑΡΧ. ΒΛΑΧΟΥ | 22:00-06:00 |

**After (template with tags):**

| ΚΕΝΤΡΟ R/T | ΩΡΕΣ |
|---|---|
| {kentro_rt_06} | 06:00-14:00 |
| {kentro_rt_14} | 14:00-22:00 |
| {kentro_rt_22} | 22:00-06:00 |

### Rules for tags

- Use only English letters, numbers, and underscores: `a-z`, `0-9`, `_`
- No spaces, no Greek characters inside the tag
- Each tag name must be unique — if you have 5 slots for leave, use `{kanonikh_1}`, `{kanonikh_2}`, etc.
- Tags for metadata like dates work too: replace `21-07-2025` with `{date}` and `ΔΕΥΤΕΡΑ` with `{hmera}`
- Empty positions (no one assigned that day) will appear blank in the exported document

### Tag naming suggestions

| Position | Suggested Tag |
|---|---|
| Director name | `{dieythyntis}` |
| Deputy Director | `{ypodieythyntis}` |
| Date | `{date}` |
| Day of week | `{hmera}` |
| Regular leave slot 1 | `{kanonikh_1}` |
| Regular leave slot 2 | `{kanonikh_2}` |
| Daily rest slot 1 | `{hmerisia_1}` |
| R/T Center morning | `{kentro_rt_06}` |
| R/T Center afternoon | `{kentro_rt_14}` |
| R/T Center night | `{kentro_rt_22}` |
| Gate guard afternoon | `{skopos_14}` |
| DIAS morning slot 1 | `{dias_prwi_1}` |

You can use any names you want — just make sure they match between the Word file and the Excel file.

### Important

- Save the file as **.docx** (Word 2010-365), NOT .doc
- The app cannot read old .doc format files

---

## Step 2: Prepare the Excel Schedule

Create a new Excel spreadsheet (.xlsx) with this structure:

### Layout

| TAG | ΠΕΡΙΓΡΑΦΗ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| date | Ημερομηνία | 21-07-2025 | 22-07-2025 | 23-07-2025 | 24-07-2025 | 25-07-2025 |
| hmera | Ημέρα | ΔΕΥΤΕΡΑ | ΤΡΙΤΗ | ΤΕΤΑΡΤΗ | ΠΕΜΠΤΗ | ΠΑΡΑΣΚΕΥΗ |
| dieythyntis | Διευθυντής | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ | Α.Δ. ΚΩΣΤΟΠΟΥΛΟΣ |
| kanonikh_1 | Κανονική Άδεια #1 | ΑΡΧ. ΤΖΑΝΕΤΟΣ | ΑΡΧ. ΤΖΑΝΕΤΟΣ | ΑΡΧ. ΤΖΑΝΕΤΟΣ | | |
| hmerisia_1 | Ημ. Ανάπαυση #1 | Π.Υ. ΖΕΡΒΑΣ | | Π.Υ. ΖΕΡΒΑΣ | | |
| kentro_rt_06 | ΚΕΝΤΡΟ R/T 06-14 | ΑΡΧ. ΠΑΠΠΑΣ | ΑΡΧ. ΒΛΑΧΟΥ | ΑΡΧ. ΝΙΚΟΥ | ΑΡΧ. ΠΑΠΠΑΣ | ΑΡΧ. ΒΛΑΧΟΥ |
| kentro_rt_14 | ΚΕΝΤΡΟ R/T 14-22 | ΑΡΧ. ΝΙΚΟΥ | ΥΠΑΡΧ. ΡΗΓΑΣ | ΑΡΧ. ΒΛΑΧΟΥ | | ΑΡΧ. ΝΙΚΟΥ |
| kentro_rt_22 | ΚΕΝΤΡΟ R/T 22-06 | ΑΡΧ. ΒΛΑΧΟΥ | ΑΡΧ. ΝΙΚΟΥ | ΑΡΧ. ΠΑΠΠΑΣ | ΑΡΧ. ΒΛΑΧΟΥ | ΥΠΑΡΧ. ΡΗΓΑΣ |
| skopos_14 | ΣΚΟΠΟΣ 14-22 | ΑΡΧ. ΔΕΛΗΣ | ΑΡΧ. ΜΠΟΥΡΑΣ | | Π.Υ. ΖΕΡΒΑΣ | ΑΡΧ. ΜΠΟΥΡΑΣ |

### Column breakdown

- **Column A (TAG):** The exact tag name, matching what's in the Word template (without the curly braces)
- **Column B (ΠΕΡΙΓΡΑΦΗ):** A human-readable description — shown in the app's review screen for your reference
- **Columns C onward (1, 2, 3...):** Day numbers. Each cell contains the name of the person assigned to that position on that day

### Rules

- If a position is empty on a certain day, just leave the cell blank
- The number of day columns determines how many days the app will process — add only the days you need (5, 7, 30, 31, whatever)
- Tag names in Column A must exactly match the tags in the Word template
- You can add rows for section headers (leave Column A empty) — the app will skip them

---

## Step 3: Using the App

1. **Launch the app** — you'll see two upload zones at the top
2. **Upload the Word template** — click the Word Template zone, select your .docx file. The app scans it and reports how many tags were found.
3. **Upload the Excel schedule** — click the Excel Schedule zone, select your .xlsx file. The app reads the schedule and reports how many days were loaded.
4. **Review assignments** — navigate day by day using the arrows or dropdown. Each row shows a position (tag + description) and who is assigned. Empty slots appear as "—".
5. **Edit if needed** — click the pencil icon next to any row to type a different name directly. Press Enter to save, Escape to cancel.
6. **Export** — choose a day range (From / To dropdowns) and click Export. The app asks you to pick an output folder, then generates one .docx file per day.

### Language toggle

Click "🇬🇧 EN" or "🇬🇷 ΕΛ" in the top-right corner to switch all interface text between English and Greek. Default is Greek.

### Dark mode

Click 🌙 / ☀️ to switch between light and dark themes.

### Clearing uploaded files

Each upload zone has a small ✕ button when a file is loaded. Click it to clear and re-upload a different file.

---

## Output

The app creates files named:

```
Duty_Roster_Day_01.docx
Duty_Roster_Day_02.docx
Duty_Roster_Day_03.docx
...
```

Each file is a copy of your original Word template with all `{tags}` replaced by the corresponding names from the Excel schedule. The formatting, fonts, and layout of your original template are preserved exactly.

---

## Tips

- **For colleagues with different templates:** They just need to create their own Word template with their own tags, and a matching Excel. No code changes needed — the system is fully dynamic.
- **Reuse the Excel:** Each month, duplicate the Excel and update the names. The tags and structure stay the same.
- **Font matching:** The exported document uses whatever font the `{tag}` was typed in. If your template uses Comic Sans MS 8pt, the names will appear in Comic Sans MS 8pt.

---

## Development & Distribution

```bash
# Run in development mode
npm run dev

# Production build
npm run build

# Package for Windows (.exe)
npx electron-builder --win

# Output goes to the dist/ folder
```

The result is a standalone `.exe` that anyone can run without installing Node.js or any other tools.

---

## Tech Stack

- **Electron** + **electron-vite** — desktop app framework
- **React** + **TypeScript** + **Tailwind CSS** — UI
- **Docxtemplater** + **PizZip** — Word document generation
- **SheetJS (xlsx)** — Excel parsing
