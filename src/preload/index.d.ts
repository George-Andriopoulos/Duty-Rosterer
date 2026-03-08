import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      // We explicitly tell TS what our custom API function looks like
      exportRoster: (
        data: unknown
      ) => Promise<{ success: boolean; error?: string }>;
    };
  }
}
