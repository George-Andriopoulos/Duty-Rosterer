import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import Docxtemplater from "docxtemplater";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import fs from "fs";
import { join } from "path";
import PizZip from "pizzip";

import icon from "../../resources/icon.png?asset";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  // ==========================================
  // Let the user pick their template file
  // ==========================================
  ipcMain.handle("select-template-file", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select Baseline Word Template",
      properties: ["openFile"],
      filters: [{ name: "Word Documents", extensions: ["docx"] }],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false };
    }

    // Return the exact path of the file the user picked on their hard drive
    return { success: true, filePath: filePaths[0] };
  });

  // ==========================================
  // OUR EXPORT ENGINE SECURELY ADDED HERE
  // ==========================================
  ipcMain.handle(
    "export-roster-to-word",
    async (event, { templatePath, rosterData }) => {
      try {
        if (!fs.existsSync(templatePath)) {
          return {
            success: false,
            error: "The uploaded template file could not be found.",
          };
        }

        const { canceled, filePath: savePath } = await dialog.showSaveDialog({
          title: "Save Final Duty Roster",
          defaultPath: "Final_Duty_Roster.docx",
          filters: [{ name: "Word Document", extensions: ["docx"] }],
        });

        if (canceled || !savePath) {
          return { success: false, error: "Cancelled by user" };
        }

        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        doc.render(rosterData);

        const buf = doc.getZip().generate({ type: "nodebuffer" });
        fs.writeFileSync(savePath, buf);

        return { success: true };
      } catch (error) {
        console.error("Export Error:", error);
        return { success: false, error: String(error) };
      }
    }
  );
  // ==========================================

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
