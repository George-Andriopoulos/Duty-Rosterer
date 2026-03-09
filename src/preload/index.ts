import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

const api = {
  scanTemplate: () => ipcRenderer.invoke("select-and-scan-template"),

  parseExcel: () => ipcRenderer.invoke("select-and-parse-excel"),

  exportDays: (payload: {
    templatePath: string;
    dayDataMap: Record<string, Record<string, string>>;
  }) => ipcRenderer.invoke("export-days", payload),
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
