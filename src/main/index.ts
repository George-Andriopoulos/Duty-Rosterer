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
  //    Opens a .docx, extracts every {tag}
  // ==========================================
  ipcMain.handle("select-and-scan-template", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select Word Template (.docx with {tags})",
      properties: ["openFile"],
      filters: [{ name: "Word Documents", extensions: ["docx"] }],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false };
    }

    try {
      const templatePath = filePaths[0];
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

      const uniqueTags = [...new Set(tags)];

      return {
        success: true,
        filePath: templatePath,
        tags: uniqueTags,
      };
    } catch (error) {
      console.error("Template scan error:", error);
      return { success: false, error: String(error) };
    }
  });

  // ==========================================
  // 2) SELECT & PARSE EXCEL SCHEDULE
  //    Header row: Name | Rank | 1 | 2 | ... | 31
  //    Data rows:  ΞΕΝΟΥ | ΑΡΧ. | kentro_rt_06 | day_off | ...
  // ==========================================
  ipcMain.handle("select-and-parse-excel", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select Excel Schedule",
      properties: ["openFile"],
      filters: [{ name: "Excel Files", extensions: ["xlsx", "xls", "csv"] }],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false };
    }

    try {
      const workbook = XLSX.readFile(filePaths[0]);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        defval: "",
      });

      if (rows.length < 2) {
        return { success: false, error: "Excel file appears empty." };
      }

      const headers = rows[0].map((h) => String(h).trim());
      const personnel: Array<{ name: string; rank: string }> = [];
      const schedule: Record<string, Record<string, string>> = {};

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const name = String(row[0] || "").trim();
        const rank = String(row[1] || "").trim();

        if (!name) continue;

        const fullName = rank ? `${rank} ${name}` : name;
        personnel.push({ name, rank });
        schedule[fullName] = {};

        for (let col = 2; col < headers.length; col++) {
          const day = String(headers[col]).trim();
          const cellValue =
            col < row.length ? String(row[col] || "").trim() : "";
          if (cellValue) {
            schedule[fullName][day] = cellValue;
          }
        }
      }

      return {
        success: true,
        filePath: filePaths[0],
        personnel,
        schedule,
        totalDays: Math.max(0, headers.length - 2),
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
          return { success: false, error: "Template file not found on disk." };
        }

        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: "Choose Output Folder",
          properties: ["openDirectory"],
        });

        if (canceled || filePaths.length === 0) {
          return { success: false, error: "Cancelled by user." };
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
