import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
  // Tells Electron to open the native file picker
  selectTemplate: () => ipcRenderer.invoke("select-template-file"),

  // Sends BOTH the chosen file path and the generated roster data to the backend
  exportRoster: (payload: {
    templatePath: string;
    rosterData: Record<string, unknown>;
  }) => ipcRenderer.invoke("export-roster-to-word", payload),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
