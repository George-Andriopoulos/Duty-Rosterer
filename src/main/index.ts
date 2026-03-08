import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import Docxtemplater from "docxtemplater";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
// 1. NEW IMPORTS FOR WORD PROCESSING
import fs from "fs";
// <-- Added dialog
import { join } from "path";
import path from "path";
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
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  // ==========================================
  // 2. OUR EXPORT ENGINE SECURELY ADDED HERE
  // ==========================================
  ipcMain.handle("export-roster-to-word", async (event, rosterData) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Save Duty Roster",
        defaultPath: "Duty_Roster_Draft.docx",
        filters: [{ name: "Word Document", extensions: ["docx"] }],
      });

      if (canceled || !filePath)
        return { success: false, error: "Cancelled by user" };

      const templatePath = path.join(
        __dirname,
        "../../resources/baseline-template.docx"
      );

      if (!fs.existsSync(templatePath)) {
        return {
          success: false,
          error: "Baseline template not found in resources folder.",
        };
      }

      const content = fs.readFileSync(templatePath, "binary");
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(rosterData);

      const buf = doc.getZip().generate({ type: "nodebuffer" });
      fs.writeFileSync(filePath, buf);

      return { success: true };
    } catch (error) {
      console.error("Export Error:", error);
      return { success: false, error: String(error) };
    }
  });
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
