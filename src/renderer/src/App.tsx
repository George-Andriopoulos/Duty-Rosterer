import { useEffect, useState } from "react";

function App(): JSX.Element {
  // State to track if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(false);

  // This hook watches the state and adds/removes the "dark" class to the root <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {/* Notice we are using our custom bg-card and border-border classes here */}
      <div className="border-border bg-card w-full max-w-md rounded-2xl border p-8 shadow-xl transition-colors duration-300">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-main text-2xl font-bold">Duty Rosterer</h1>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <p className="text-muted mb-6 text-sm">
          Upload your baseline Word document or personnel form to begin
          generating the schedule.
        </p>

        <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95">
          Select Document
        </button>
      </div>
    </div>
  );
}

export default App;
