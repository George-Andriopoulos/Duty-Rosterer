import { ElectronAPI } from "@electron-toolkit/preload";

interface TemplateScanResult {
  success: boolean;
  filePath?: string;
  tags?: string[];
  error?: string;
}

interface ExcelParseResult {
  success: boolean;
  filePath?: string;
  personnel?: Array<{ name: string; rank: string }>;
  schedule?: Record<string, Record<string, string>>;
  totalDays?: number;
  error?: string;
}

interface ExportResult {
  success: boolean;
  count?: number;
  outputDir?: string;
  error?: string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      scanTemplate: () => Promise<TemplateScanResult>;
      parseExcel: () => Promise<ExcelParseResult>;
      exportDays: (data: {
        templatePath: string;
        dayDataMap: Record<string, Record<string, string>>;
      }) => Promise<ExportResult>;
    };
  }
}
