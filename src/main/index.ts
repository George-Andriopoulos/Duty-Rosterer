import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import Docxtemplater from "docxtemplater";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import fs from "fs";
import { join } from "path";
import PizZip from "pizzip";
import * as XLSX from "xlsx";

import icon from "../../resources/icon.png?asset";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // ==========================================
  // 1) SELECT & SCAN WORD TEMPLATE
  // ==========================================
  ipcMain.handle("select-and-scan-template", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select Word Template (.docx with {tags})",
      properties: ["openFile"],
      filters: [
        { name: "Word Documents", extensions: ["docx", "doc"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (canceled || filePaths.length === 0) return { success: false };

    const templatePath = filePaths[0];

    if (!templatePath.toLowerCase().endsWith(".docx")) {
      return {
        success: false,
        error:
          "Μόνο αρχεία .docx υποστηρίζονται. Ανοίξτε το .doc στο Word/LibreOffice → Αποθήκευση ως → Word 2010-365 (.docx).",
      };
    }

    try {
      const content = fs.readFileSync(templatePath, "binary");
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const text = doc.getFullText();
      const tagRegex = /\{([^{}]+)\}/g;
      const tags: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = tagRegex.exec(text)) !== null) {
        tags.push(match[1]);
      }

      return {
        success: true,
        filePath: templatePath,
        tags: [...new Set(tags)],
      };
    } catch (error) {
      console.error("Template scan error:", error);
      return { success: false, error: String(error) };
    }
  });

  // ==========================================
  // 2) SELECT & PARSE EXCEL — POSITION-BASED
  //    Format:
  //    Row 0 (header): TAG | DESCRIPTION | 1 | 2 | 3 | ... | 31
  //    Row 1+:         kentro_rt_06 | ΚΕΝΤΡΟ R/T 06-14 | ΑΡΧ. ΣΧΟΙΝΑΣ | ...
  //
  //    Output: schedule[dayNumber] = { tag: name, ... }
  // ==========================================
  ipcMain.handle("select-and-parse-excel", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select Excel Schedule",
      properties: ["openFile"],
      filters: [
        { name: "Excel Files", extensions: ["xlsx", "xls", "csv", "ods"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (canceled || filePaths.length === 0) return { success: false };

    try {
      const workbook = XLSX.readFile(filePaths[0]);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        defval: "",
      });

      if (rows.length < 2) {
        return { success: false, error: "Το αρχείο Excel φαίνεται κενό." };
      }

      const headers = rows[0].map((h) => String(h).trim());

      // Day columns start at index 2 (after TAG and DESCRIPTION)
      const dayColumns: { index: number; day: string }[] = [];
      for (let col = 2; col < headers.length; col++) {
        const day = String(headers[col]).trim();
        if (day) dayColumns.push({ index: col, day });
      }

      // Build schedule: dayNumber → { tag: name }
      const schedule: Record<string, Record<string, string>> = {};
      const tagDescriptions: Record<string, string> = {};

      // Initialize each day
      for (const dc of dayColumns) {
        schedule[dc.day] = {};
      }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const tag = String(row[0] || "").trim();

        if (!tag) continue; // Skip section headers / empty rows

        const description = String(row[1] || "").trim();
        if (description) tagDescriptions[tag] = description;

        for (const dc of dayColumns) {
          const value =
            dc.index < row.length ? String(row[dc.index] || "").trim() : "";
          schedule[dc.day][tag] = value;
        }
      }

      const dayNumbers = dayColumns.map((dc) => dc.day);

      return {
        success: true,
        filePath: filePaths[0],
        schedule,
        tagDescriptions,
        dayNumbers,
      };
    } catch (error) {
      console.error("Excel parse error:", error);
      return { success: false, error: String(error) };
    }
  });

  // ==========================================
  // 3) EXPORT — Generate one .docx per day
  // ==========================================
  ipcMain.handle(
    "export-days",
    async (
      _event,
      {
        templatePath,
        dayDataMap,
      }: {
        templatePath: string;
        dayDataMap: Record<string, Record<string, string>>;
      }
    ) => {
      try {
        if (!fs.existsSync(templatePath)) {
          return { success: false, error: "Το αρχείο template δεν βρέθηκε." };
        }

        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: "Επιλέξτε φάκελο εξαγωγής",
          properties: ["openDirectory"],
        });

        if (canceled || filePaths.length === 0) {
          return { success: false, error: "Ακυρώθηκε." };
        }

        const outputDir = filePaths[0];
        const templateContent = fs.readFileSync(templatePath, "binary");
        const days = Object.keys(dayDataMap).sort(
          (a, b) => Number(a) - Number(b)
        );

        for (const day of days) {
          const zip = new PizZip(templateContent);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.render(dayDataMap[day]);

          const buf = doc.getZip().generate({ type: "nodebuffer" });
          const fileName = `Duty_Roster_Day_${day.padStart(2, "0")}.docx`;
          fs.writeFileSync(join(outputDir, fileName), buf);
        }

        return { success: true, count: days.length, outputDir };
      } catch (error) {
        console.error("Export error:", error);
        return { success: false, error: String(error) };
      }
    }
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
